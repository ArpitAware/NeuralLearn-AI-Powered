import { AnimatePresence } from 'framer-motion';
import { Modal } from './UI';
import useUIStore from '../../store/uiStore';

export default function ModalManager() {
  const { modal, closeModal } = useUIStore();
  return (
    <AnimatePresence>
      {modal && (
        <Modal isOpen={!!modal} onClose={closeModal} title={modal.title} maxWidth={modal.maxWidth}>
          {modal.content}
        </Modal>
      )}
    </AnimatePresence>
  );
}
