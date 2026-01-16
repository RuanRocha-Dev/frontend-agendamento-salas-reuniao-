import { useState } from 'react';
import type { CreateRoomData } from '../types';
import { Modal } from './Modal';
import './Form.css';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRoomData) => void;
}

export function CreateRoomModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateRoomModalProps) {
  const [name, setName] = useState('');
  const [capacity, setMaxParticipants] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Nome da sala é obrigatório';
    }

    if (!capacity) {
      newErrors.capacity = 'Capacidade é obrigatória';
    } else if (parseInt(capacity) < 1) {
      newErrors.capacity = 'Capacidade deve ser no mínimo 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit({
        name: name.trim(),
        capacity: parseInt(capacity),
      });
      setName('');
      setMaxParticipants('');
      setErrors({});
    }
  };

  const handleClose = () => {
    setName('');
    setMaxParticipants('');
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Criar Nova Sala">
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Nome da Sala
          </label>
          <input
            id="name"
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
          <label htmlFor="capacity" className="form-label">
            Capacidade Máxima
          </label>
          <input
            id="capacity"
            type="number"
            value={capacity}
            onChange={(e) => setMaxParticipants(e.target.value)}
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
            className="btn-submit"
          >
            Criar Sala
          </button>
        </div>
      </form>
    </Modal>
  );
}
