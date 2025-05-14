import React, { useState, useEffect } from 'react';
import { Message, User } from '../models/types';
import { retrieveData, STORAGE_KEYS, addItem } from '../services/storageService';
import { useAuth } from '../contexts/AuthContext';
import { Send } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const Messages: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<User[]>([]);
  const [selectedContact, setSelectedContact] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState('');
  
  useEffect(() => {
    if (!user) return;
    
    const allMessages = retrieveData<Message[]>(STORAGE_KEYS.MESSAGES, []);
    const userMessages = allMessages.filter(
      msg => msg.senderId === user.id || msg.receiverId === user.id
    );
    setMessages(userMessages);
    
    // Get unique contacts from messages
    const contactIds = new Set([
      ...userMessages.map(msg => msg.senderId),
      ...userMessages.map(msg => msg.receiverId)
    ]);
    contactIds.delete(user.id);
    
    const allUsers = retrieveData<User[]>(STORAGE_KEYS.USERS, []);
    const userContacts = allUsers.filter(u => contactIds.has(u.id));
    setContacts(userContacts);
  }, [user]);
  
  const handleSendMessage = () => {
    if (!user || !selectedContact || !newMessage.trim()) return;
    
    const message: Message = {
      id: uuidv4(),
      senderId: user.id,
      receiverId: selectedContact.id,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      isRead: false
    };
    
    addItem(STORAGE_KEYS.MESSAGES, message);
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };
  
  const getContactMessages = (contactId: string) => {
    return messages.filter(
      msg => 
        (msg.senderId === user?.id && msg.receiverId === contactId) ||
        (msg.senderId === contactId && msg.receiverId === user?.id)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 divide-x divide-gray-200 h-[calc(100vh-12rem)]">
            {/* Contacts sidebar */}
            <div className="col-span-4 bg-gray-50">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
              </div>
              <div className="overflow-y-auto h-[calc(100%-4rem)]">
                {contacts.map(contact => (
                  <button
                    key={contact.id}
                    className={`w-full text-left p-4 hover:bg-gray-100 focus:outline-none ${
                      selectedContact?.id === contact.id ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <div className="flex items-center">
                      <div className="bg-primary-100 text-primary-800 h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium">
                        {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {contact.firstName} {contact.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{contact.role}</p>
                      </div>
                    </div>
                  </button>
                ))}
                
                {contacts.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    No messages yet
                  </div>
                )}
              </div>
            </div>
            
            {/* Chat area */}
            <div className="col-span-8 flex flex-col">
              {selectedContact ? (
                <>
                  <div className="p-4 border-b bg-white">
                    <div className="flex items-center">
                      <div className="bg-primary-100 text-primary-800 h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium">
                        {selectedContact.firstName.charAt(0)}{selectedContact.lastName.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {selectedContact.firstName} {selectedContact.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{selectedContact.role}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {getContactMessages(selectedContact.id).map(message => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs rounded-lg px-4 py-2 ${
                            message.senderId === user?.id
                              ? 'bg-primary-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 border-t bg-white">
                    <div className="flex space-x-4">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSendMessage();
                          }
                        }}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <Send className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                      Select a contact to start messaging
                    </h3>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;