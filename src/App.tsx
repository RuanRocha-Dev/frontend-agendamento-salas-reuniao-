import { useEffect, useState } from 'react';
import type { MeetingRoom, CreateRoomData, EditRoomData, ScheduleMeetingData, dataRooms } from './types';
import { MeetingRoomCard } from './components/MeetingRoomCard';
import { CreateRoomModal } from './components/CreateRoomModal';
import { Modal } from './components/Modal';
import { EditRoomModal } from './components/EditRoomModal';
import { ScheduleMeetingModal } from './components/ScheduleMeetingModal';
import './index.css';
import api from './api/axios';

function App() {
  const [rooms, setRooms] = useState<dataRooms[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [genericModal, setGenericModal] = useState(false);
  const [titleModal, setTitleModal] = useState("⚠️ Atenção");
  const [msgModal, setMsgModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [idRoomAppointment, setIdRoomAppointment] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<MeetingRoom | null>(null);

  const handleCreateRoom = (data: CreateRoomData) => {
    api.post('api/room/create', {
      name: data.name,
      capacity: data.capacity,
    }).then((resp) => {
      if(resp?.data?.data?.status) {
        setIsCreateModalOpen(false);
        getRoomsAvailable()
        return;
      }

    }).catch((error) => {
        const msgError = error?.response?.data?.message || 'Erro ao criar sala';
        setMsgModal(msgError)
        setGenericModal(true);
    });
  };

  const updateRoom = async (data: EditRoomData) => {
    try {
      const resp = await api.post('api/room/update', {
        id: data.id,
        name: data.name,
        capacity: data.capacity,
      });
      
      if(resp?.data?.success) {
        getRoomsAvailable();
        setIsEditModalOpen(false);
      }      
    } catch (error: unknown) {
        const msgError = error?.response?.data?.message || 'Erro ao editar sala';
        setMsgModal(msgError)
        setGenericModal(true);
    }
  }

  const createAppointment = async (data: ScheduleMeetingData) => {
    try {
      const resp = await api.post('api/appointment/create', {
        idMeetingRoom: idRoomAppointment,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
      });
      
      if(resp?.data?.success) {
        setIsScheduleModalOpen(false);
        setSelectedRoom(null);
        setIdRoomAppointment(0);

        setTitleModal("✅ Sucesso")
        setMsgModal(resp?.data?.message)
        setGenericModal(true);
      }
    } catch (error: unknown) {
        const msgError = error?.response?.data?.message || 'Erro ao criar agendamento';
        setMsgModal(msgError)
        setGenericModal(true);

        setIsScheduleModalOpen(false);
        setIdRoomAppointment(0);
    }
  }

  const handleEditRoom = (room: MeetingRoom) => {
    setSelectedRoom(room);
    setIsEditModalOpen(true);
  };

  const getRoomsAvailable = async () => {
    const response = await api.get('api/room/findAll');
    setRooms(response.data.data || []);
  }

  useEffect(() => {
    getRoomsAvailable();
  }, []);

  const deleteRoom = async (id: number) => {
    try {
      const resp = await api.post('api/room/delete', {
        id: id
      });
      
      if(resp?.data?.success) {
        setTitleModal("✅ Sucesso")
        setMsgModal(resp?.data?.message)
        setGenericModal(true);
        getRoomsAvailable();
      }
    } catch (error: unknown) {
        const msgError = error?.response?.data?.message || 'Erro ao criar agendamento';
        setMsgModal(msgError)
        setGenericModal(true);
    }
    setRooms(rooms.filter((room) => room.id !== id));
  };

  const handleScheduleMeeting = (room: MeetingRoom) => {
    setSelectedRoom(room);
    setIsScheduleModalOpen(true);
    setIdRoomAppointment(room.id)
  };

  return (
    <div>
      <header>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1> Gerenciador de Salas</h1>
            <p>Controle suas salas de reunião</p>
          </div>
          <button
            className="btn-primary-header"
            onClick={() => setIsCreateModalOpen(true)}
            title="Criar nova sala"
          >
            <span>+</span>
            <span>Nova Sala</span>
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '80rem', margin: '0 auto', padding: '3rem 1rem' }}>
        {rooms.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">📭</span>
            <h2 className="empty-state-title">Nenhuma sala criada</h2>
            <p className="empty-state-text">
              Clique em "Nova Sala" para criar sua primeira sala de reunião
            </p>
          </div>
        ) : (
          <div className="cards-grid">
            {rooms.map((room) => (
              <MeetingRoomCard
                key={room.id}
                room={room}
                onEdit={handleEditRoom}
                onDelete={deleteRoom}
                onSchedule={handleScheduleMeeting}
              />
            ))}
          </div>
        )}
      </main>

      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateRoom}
      />

      <EditRoomModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedRoom(null);
        }}
        onSubmit={updateRoom}
        room={selectedRoom}
      />

      <Modal
        isOpen={genericModal}
        onClose={() => {
          setGenericModal(false);
        }}
        title={titleModal}
        children={msgModal}
      />

      <ScheduleMeetingModal
        isOpen={isScheduleModalOpen}
        onClose={() => {
          setIsScheduleModalOpen(false);
          setSelectedRoom(null);
          setIdRoomAppointment(0);
        }}
        onSubmit={createAppointment}
        room={selectedRoom}
      />
    </div>
  );
}

export default App;
