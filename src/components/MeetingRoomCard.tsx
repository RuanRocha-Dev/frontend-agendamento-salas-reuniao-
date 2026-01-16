import type { MeetingRoom } from '../types';
import './MeetingRoomCard.css';

interface MeetingRoomCardProps {
  room: MeetingRoom;
  onEdit: (room: MeetingRoom) => void;
  onDelete: (id: number) => void;
  onSchedule: (room: MeetingRoom) => void;
}

export function MeetingRoomCard({
  room,
  onEdit,
  onDelete,
  onSchedule,
}: MeetingRoomCardProps) {
  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja deletar "${room.name}"?`)) {
      onDelete(room.id);
    }
  };

  return (
    <div className="room-card">
      <div className="room-card-header">
        <h3 className="room-card-title">{room.name}</h3>
        <div className="room-card-capacity">
          <span className="room-card-icon">👥</span>
          <span>{room.capacity} pessoas</span>
        </div>
      </div>

      <div className="room-card-body">
        <p className="room-card-date">
          Criada em: {new Date(room.createdAt).toLocaleDateString('pt-BR')}
        </p>

        <div className="room-card-actions">
          <button
            onClick={() => onSchedule(room)}
            className="btn btn-success"
            title="Agendar reunião"
          >
            📅 Agendar
          </button>
          <button
            onClick={() => onEdit(room)}
            className="btn btn-primary"
            title="Editar sala"
          >
            ✏️ Editar
          </button>
          <button
            onClick={handleDelete}
            className="btn btn-danger"
            title="Deletar sala"
          >
            🗑️ Deletar
          </button>
        </div>
      </div>
    </div>
  );
}
