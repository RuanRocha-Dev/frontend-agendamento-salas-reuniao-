import { useState, useEffect } from 'react';
import type { MeetingRoom, ScheduleMeetingData } from '../types';
import { Modal } from './Modal';
import './Form.css';

interface ScheduleMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ScheduleMeetingData) => void;
  room: MeetingRoom | null;
}

export function ScheduleMeetingModal({
  isOpen,
  onClose,
  onSubmit,
  room,
}: ScheduleMeetingModalProps) {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [idMeetingRoom, setIdMeetingRoom] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) {
      setStartTime('');
      setEndTime('');
      setIdMeetingRoom('');
      setDescription('');
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!startTime.trim()) {
      newErrors.startTime = 'Data/hora de início é obrigatória';
    }

    if (!endTime.trim()) {
      newErrors.endTime = 'Data/hora de fim é obrigatória';
    }

    if (startTime && endTime && startTime >= endTime) {
      newErrors.endTime = 'Data/hora de fim deve ser após a data/hora de início';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit({
        idMeetingRoom: Number(idMeetingRoom),
        description: description.trim(),
        startTime: startTime.trim(),
        endTime: endTime.trim(),
      });
      setStartTime('');
      setEndTime('');
      setIdMeetingRoom('');
      setDescription('');
      setErrors({});
    }
  };

  const handleClose = () => {
    setStartTime('');
    setEndTime('');
    setIdMeetingRoom('');
    setDescription('');
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Agendar Reunião - ${room?.name || ''}`}>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="startTime" className="form-label">
            Data/Hora de Início
          </label>
          <input
            id="startTime"
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className={`form-input ${errors.startTime ? 'form-input-error' : ''}`}
          />
          {errors.startTime && (
            <span className="form-error">{errors.startTime}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="endTime" className="form-label">
            Data/Hora de Fim
          </label>
          <input
            id="endTime"
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className={`form-input ${errors.endTime ? 'form-input-error' : ''}`}
          />
          {errors.endTime && (
            <span className="form-error">{errors.endTime}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            descrição
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Reunião de alinhamento"
            className={`form-input ${errors.description ? 'form-input-error' : ''}`}
            maxLength={100}
          />
          {errors.description && <span className="form-error">{errors.description}</span>}
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
            className="btn-submit btn-success"
          >
            Agendar Reunião
          </button>
        </div>
      </form>
    </Modal>
  );
}
