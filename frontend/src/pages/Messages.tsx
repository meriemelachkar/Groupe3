import React, { useEffect, useState } from 'react';
import { Send, Mail, MailOpen, User } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

// Types matching backend Message schema
interface UserPreview {
    _id?: string;
    nom?: string;
    prenom?: string;
    email?: string;
}

interface MessageItem {
    _id: string;
    expediteurId: UserPreview | string;
    destinataireId: UserPreview | string;
    contenu: string;
    lu: boolean;
    createdAt: string;
}

export const Messages: React.FC = () => {
    const [messages, setMessages] = useState<MessageItem[]>([]);
    const [selectedMessage, setSelectedMessage] = useState<MessageItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [showNewMessage, setShowNewMessage] = useState(false);
    const [newMessage, setNewMessage] = useState({ destinataireId: '', contenu: '' });
    const [users, setUsers] = useState<UserPreview[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            loadMessages();
        }
    }, [user]);

    const loadMessages = async () => {
        try {
            const res = await api.get('/messages');
            // backend populates expediteurId and destinataireId
            const data = res.data || [];
            setMessages(data.map((m: any) => ({
                _id: m._id || m.id,
                expediteurId: m.expediteurId,
                destinataireId: m.destinataireId,
                contenu: m.contenu,
                lu: m.lu,
                createdAt: m.createdAt || m.created_at,
            })));

            // derive users list from messages (people you've conversed with)
            const others: Record<string, UserPreview> = {};
            (data || []).forEach((m: any) => {
                const e = m.expediteurId;
                const d = m.destinataireId;
                if (e && e._id && e._id !== user?.userId) others[e._id] = { _id: e._id, nom: e.nom, prenom: e.prenom, email: e.email };
                if (d && d._id && d._id !== user?.userId) others[d._id] = { _id: d._id, nom: d.nom, prenom: d.prenom, email: d.email };
            });
            setUsers(Object.values(others));
        } catch (error) {
            console.error('Erreur lors du chargement des messages :', error);
        } finally {
            setLoading(false);
        }
    };

    // no global users list endpoint (restricted). We use conversation participants derived from messages as recipients.

    const markAsRead = async (messageId: string) => {
        try {
            await api.patch(`/messages/${messageId}/lu`);
            loadMessages();
        } catch (error) {
            console.error("Erreur lors du marquage du message comme lu :", error);
        }
    };

    const handleSelectMessage = (message: MessageItem) => {
        setSelectedMessage(message);
        const isReceived = typeof message.destinataireId !== 'string' ? (message.destinataireId as any)._id === user?.userId : message.destinataireId === user?.userId;
        if (!message.lu && isReceived) {
            markAsRead(message._id);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                destinataireId: newMessage.destinataireId,
                contenu: newMessage.contenu,
            };
            await api.post('/messages', payload);

            setNewMessage({ destinataireId: '', contenu: '' });
            setShowNewMessage(false);
            loadMessages();
        } catch (error) {
            console.error("Erreur lors de l'envoi du message :", error);
        }
    };

    const getUnreadCount = () => messages.filter((m) => !m.lu && (typeof m.destinataireId === 'string' ? m.destinataireId === user?.userId : (m.destinataireId as any)?._id === user?.userId)).length;

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Messages</h1>
                            {getUnreadCount() > 0 && (
                                <p className="text-slate-600 mt-2">
                                    {getUnreadCount()} message{getUnreadCount() > 1 ? 's' : ''} non lu
                                    {getUnreadCount() > 1 ? 's' : ''}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => setShowNewMessage(true)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition flex items-center gap-2"
                        >
                            <Send size={20} />
                            Nouveau Message
                        </button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="p-4 border-b border-slate-200">
                                <h2 className="font-semibold text-slate-900">Boîte de réception</h2>
                            </div>
                            <div className="divide-y divide-slate-200 max-h-[600px] overflow-y-auto">
                                {messages.map((message) => {
                                    const isReceived = typeof message.destinataireId === 'string' ? message.destinataireId === user?.userId : (message.destinataireId as any)?._id === user?.userId;
                                    const otherUser = isReceived ? message.expediteurId : message.destinataireId;
                                    const isUnread = !message.lu && isReceived;

                                    return (
                                        <div
                                            key={message._id}
                                            onClick={() => handleSelectMessage(message)}
                                            className={`p-4 cursor-pointer hover:bg-slate-50 transition ${selectedMessage?._id === message._id ? 'bg-emerald-50' : ''} ${isUnread ? 'bg-blue-50' : ''}`}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <User size={16} className="text-slate-400" />
                                                    <span className={`text-sm ${isUnread ? 'font-bold' : 'font-medium'}`}>
                                                        {typeof otherUser === 'string' ? 'Utilisateur' : `${(otherUser as any).nom || ''} ${(otherUser as any).prenom || ''}`.trim() || 'Utilisateur'}
                                                    </span>
                                                </div>
                                                {isUnread ? (
                                                    <Mail size={16} className="text-blue-600" />
                                                ) : (
                                                    <MailOpen size={16} className="text-slate-400" />
                                                )}
                                            </div>
                                            <div className={`text-sm ${isUnread ? 'font-semibold' : ''} text-slate-900 mb-1`}>
                                                {message.contenu.slice(0, 80)}{message.contenu.length > 80 ? '…' : ''}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {new Date(message.createdAt).toLocaleDateString('fr-FR')} à {' '}
                                                {new Date(message.createdAt).toLocaleTimeString('fr-FR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                                {messages.length === 0 && (
                                    <div className="p-8 text-center">
                                        <Mail className="mx-auto text-slate-400 mb-3" size={40} />
                                        <p className="text-slate-600">Aucun message</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="md:col-span-2 bg-white rounded-lg shadow">
                            {selectedMessage ? (
                                <div className="flex flex-col h-full">
                                    <div className="p-6 border-b border-slate-200">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <User size={16} />
                                            <span className="text-sm">
                                                {(() => {
                                                    const isSent = typeof selectedMessage.destinataireId === 'string' ? selectedMessage.expediteurId === user?.userId : (selectedMessage.expediteurId as any)?._id === user?.userId;
                                                    const other = isSent ? selectedMessage.destinataireId : selectedMessage.expediteurId;
                                                    if (typeof other === 'string') return 'Utilisateur';
                                                    return `${(other as any).nom || ''} ${(other as any).prenom || ''}`.trim() || 'Utilisateur';
                                                })()}
                                            </span>
                                            <span className="text-sm">
                                                • {new Date(selectedMessage.createdAt).toLocaleDateString('fr-FR')} à {' '}
                                                {new Date(selectedMessage.createdAt).toLocaleTimeString('fr-FR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1">
                                        <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                                            {selectedMessage.contenu}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full p-12">
                                    <div className="text-center">
                                        <Mail className="mx-auto text-slate-400 mb-4" size={64} />
                                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                            Sélectionnez un message
                                        </h3>
                                        <p className="text-slate-600">Choisissez un message pour le lire</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {showNewMessage && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">Nouveau Message</h2>
                                <form onSubmit={handleSendMessage} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Destinataire</label>
                                        <select
                                            value={newMessage.destinataireId}
                                            onChange={(e) => setNewMessage({ ...newMessage, destinataireId: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        >
                                            <option value="">Sélectionner un utilisateur</option>
                                            {users.map((u) => (
                                                <option key={u._id} value={u._id}>
                                                    {`${u.nom || ''} ${u.prenom || ''}`.trim() || u.email || 'Utilisateur'}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                                        <textarea
                                            value={newMessage.contenu}
                                            onChange={(e) => setNewMessage({ ...newMessage, contenu: e.target.value })}
                                            required
                                            rows={6}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            placeholder="Votre message..."
                                        />
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowNewMessage(false)}
                                            className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition"
                                        >
                                            Envoyer
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
