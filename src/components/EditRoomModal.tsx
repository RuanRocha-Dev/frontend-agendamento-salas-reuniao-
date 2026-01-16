import { useState, useEffect } from 'react';
import type { MeetingRoom, EditRoomData } from '../types';
import { Modal } from './Modal';
import './Form.css';

interface EditRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EditRoomData) => void;
  room: MeetingRoom | null;
}

export function EditRoomModal({
  isOpen,
  onClose,
  onSubmit,
  room,
}: EditRoomModalProps) {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (room && isOpen) {
      setId(room.id);
      setName(room.name);
      setCapacity(room.capacity.toString());
      setErrors({});
    }
  }, [room, isOpen]);

  const handleClose = () => {
    setId('');
    setName('');
    setCapacity('');
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Editar Sala">
      <div className="form">
        <div className="form-group">
          <label htmlFor="edit-name" className="form-label">
            Nome da Sala
          </label>
          <input
            id="edit-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Sala de Conferência A"
            className={`form-input ${errors.name ? 'form-input-error' : ''}`}
            maxLength={100}
          />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="edit-capacity" className="form-label">
            Capacidade Máxima
          </label>
          <input
            id="edit-capacity"
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            placeholder="Ex: 10"
            className={`form-input ${errors.capacity ? 'form-input-error' : ''}`}
            min="1"
            max="999"
          />
          {errors.capacity && (
            <span className="form-error">{errors.capacity}</span>
          )}
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={handleClose} 
            className="btn-cancel"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            onClick={() => onSubmit({id: Number(id), name, capacity: Number(capacity)})} 
            className="btn-submit"
          >
            Atualizar
          </button>
        </div>
      </div>
    </Modal>
  );
}
