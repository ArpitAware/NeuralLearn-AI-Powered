# rag_chatbot.py
# NeuralLearn RAG Chatbot — Built with LangChain + Groq + FAISS
# ---------------------------------------------------------------

import warnings
warnings.filterwarnings("ignore")

from dotenv import load_dotenv

from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.output_parsers import StrOutputParser

from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS


# ---------------------------------------------------------------
# CONFIGURATION
# ---------------------------------------------------------------

DOCUMENT_PATH   = "neurallearn.txt"
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
LLM_MODEL       = "llama-3.1-8b-instant"
CHUNK_SIZE      = 500
CHUNK_OVERLAP   = 50
RETRIEVER_K     = 4          # how many chunks to retrieve
MAX_HISTORY     = 10         # max messages to keep in memory (5 exchanges)


# ---------------------------------------------------------------
# LOAD & PROCESS DOCUMENT
# ---------------------------------------------------------------

load_dotenv()

print("📄 Loading document...")
loader    = TextLoader(DOCUMENT_PATH, encoding="utf-8")
documents = loader.load()

print("✂️  Splitting into chunks...")
splitter = RecursiveCharacterTextSplitter(
    chunk_size=CHUNK_SIZE,
    chunk_overlap=CHUNK_OVERLAP
)
chunks = splitter.split_documents(documents)
print(f"   → {len(chunks)} chunks created")


# ---------------------------------------------------------------
# EMBEDDINGS & VECTOR STORE
# ---------------------------------------------------------------

print("🧠 Loading embedding model...")
embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)

print("🗄️  Building vector store...")
vectorstore = FAISS.from_documents(chunks, embeddings)

retriever = vectorstore.as_retriever(
    search_type="similarity",
    search_kwargs={"k": RETRIEVER_K}
)
print("   → Vector store ready!\n")


# ---------------------------------------------------------------
# LLM
# ---------------------------------------------------------------

llm = ChatGroq(model=LLM_MODEL, temperature=0.5)


# ---------------------------------------------------------------
# PROMPT TEMPLATE
# ---------------------------------------------------------------

prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        """You are NeuralLearn's intelligent assistant, designed to help users understand the NeuralLearn platform.

Your behavior:
- Answer questions about NeuralLearn using ONLY the provided context below.
- If a question is outside the NeuralLearn context (general knowledge, coding, etc.), answer using your own knowledge and clearly mention it.
- Keep answers clear, concise, and helpful.
- If you genuinely don't know something and it's not in the context, say: "I don't have that information about NeuralLearn right now."

Context from NeuralLearn documents:
{context}
"""
    ),
    MessagesPlaceholder(variable_name="history"),
    ("human", "{input}")
])


# ---------------------------------------------------------------
# CHAIN
# ---------------------------------------------------------------

chain = prompt | llm | StrOutputParser()


# ---------------------------------------------------------------
# MEMORY (with size limit)
# ---------------------------------------------------------------

history = []

def update_history(user_input: str, ai_response: str):
    """Add messages to history and trim if it exceeds MAX_HISTORY."""
    history.append(HumanMessage(content=user_input))
    history.append(AIMessage(content=ai_response))

    # Keep only the last MAX_HISTORY messages
    if len(history) > MAX_HISTORY:
        del history[:2]  # remove oldest exchange (human + AI pair)


# ---------------------------------------------------------------
# CHAT FUNCTION (with streaming)
# ---------------------------------------------------------------

def chat(user_input: str):
    """Retrieve context, stream the response, and update memory."""

    # Retrieve relevant chunks from vector store
    retrieved_docs = retriever.invoke(user_input)
    context = "\n\n".join(doc.page_content for doc in retrieved_docs)

    # Stream the response token by token
    print("\nAI: ", end="", flush=True)
    full_response = ""

    for chunk in chain.stream({
        "input":   user_input,
        "history": history,
        "context": context
    }):
        print(chunk, end="", flush=True)
        full_response += chunk

    print("\n")  # newline after streaming ends

    # Save to memory
    update_history(user_input, full_response)

    return full_response


# ---------------------------------------------------------------
# CHAT LOOP
# ---------------------------------------------------------------

print("=" * 50)
print("  🤖 NeuralLearn Assistant — Powered by LangChain")
print("  Type 'exit' or 'quit' to end the chat")
print("=" * 50 + "\n")

if __name__ == "__main__":
    while True:
        user_input = input("You: ").strip()
        if not user_input:
            continue
        if user_input.lower() in ["exit", "quit"]:
            print("Chat ended. Goodbye! 👋")
            break
        chat(user_input)