from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_core.messages import HumanMessage, AIMessage

from rag_chatbot import chain, retriever

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

session_store = {}
MAX_HISTORY = 10

class ChatRequest(BaseModel):
    message: str
    session_id: str


def get_history(session_id: str):
    if session_id not in session_store:
        session_store[session_id] = []
    return session_store[session_id]


def update_history(session_id: str, user_input: str, ai_response: str):
    history = session_store[session_id]
    history.append(HumanMessage(content=user_input))
    history.append(AIMessage(content=ai_response))
    if len(history) > MAX_HISTORY:
        session_store[session_id] = history[-MAX_HISTORY:]


@app.post("/chat")
async def chat_endpoint(req: ChatRequest):
    history = get_history(req.session_id)

    retrieved_docs = retriever.invoke(req.message)
    context = "\n\n".join(doc.page_content for doc in retrieved_docs)

    full_response = ""
    for chunk in chain.stream({
        "input":   req.message,
        "history": history,
        "context": context
    }):
        full_response += chunk

    update_history(req.session_id, req.message, full_response)
    return {"reply": full_response}


@app.delete("/chat/{session_id}")
def clear_session(session_id: str):
    session_store.pop(session_id, None)
    return {"status": "cleared"}