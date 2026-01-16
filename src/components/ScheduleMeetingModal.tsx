import { useState, useEffect } from 'react';
import type { MeetingRoom, ScheduleMeetingData, Appointment } from '../types';
import { Modal } from './Modal';
import './Form.css';
import './ScheduleMeetingModal.css';

interface ScheduleMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ScheduleMeetingData) => void;
  room: MeetingRoom | null;
  appointments?: Appointment[];
}

export function ScheduleMeetingModal({
  isOpen,
  onClose,
  onSubmit,
  room,
  appointments = [],
}: ScheduleMeetingModalProps) {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [idMeetingRoom, setIdMeetingRoom] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) {
      const timeoutId = setTimeout(() => {
        setStartTime('');
        setEndTime('');
        setIdMeetingRoom('');
        setDescription('');
        setErrors({});
      }, 0);
      return () => clearTimeout(timeoutId);
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
      <div className="schedule-meeting-container">
        <div className="schedule-form-section">
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
        </div>
        <div className="appointments-section">
          <h3 className="appointments-title">Agendamentos Futuros</h3>
          <div className="appointments-list">
            {appointments && appointments.length > 0 ? (
              appointments.map((appointment) => (
                <div key={appointment.id} className="appointment-card">
                  <div className="appointment-header">
                    <span className="appointment-time">
                      {new Date(appointment.startTime).toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        timeZone: 'UTC'
                      })}
                    </span>
                    <span className="appointment-date">
                      {new Date(appointment.startTime).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="appointment-body">
                    <p className="appointment-description">{appointment.description}</p>
                    <div className="appointment-time-range">
                      <span className="time-badge">
                        {new Date(appointment.startTime).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          timeZone: 'UTC'
                        })} - {new Date(appointment.endTime).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          timeZone: 'UTC' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-appointments">
                <span className="empty-icon">📅</span>
                <p>Nenhum agendamento futuro</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
