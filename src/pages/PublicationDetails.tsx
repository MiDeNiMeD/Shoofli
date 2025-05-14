import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Publication, Comment, User } from '../models/types';
import { retrieveData, STORAGE_KEYS, addItem } from '../services/storageService';
import { useAuth } from '../contexts/AuthContext';
import { MessageSquare, Calendar, MapPin, User as UserIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const PublicationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [publication, setPublication] = useState<Publication | null>(null);
  const [client, setClient] = useState<User | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (id) {
      const pub = retrieveData<Publication[]>(STORAGE_KEYS.PUBLICATIONS, [])
        .find(p => p.id === id);
      setPublication(pub || null);
      
      if (pub) {
        const pubClient = retrieveData<User[]>(STORAGE_KEYS.USERS, [])
          .find(u => u.id === pub.clientId);
        setClient(pubClient || null);
        
        const pubComments = retrieveData<Comment[]>(STORAGE_KEYS.COMMENTS, [])
          .filter(c => c.targetId === id && c.targetType === 'Publication')
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setComments(pubComments);
      }
    }
  }, [id]);
  
  const handleSubmitComment = () => {
    if (!user || !publication || !newComment.trim()) return;
    
    try {
      const comment: Comment = {
        id: uuidv4(),
        content: newComment.trim(),
        authorId: user.id,
        targetId: publication.id,
        targetType: 'Publication',
        createdAt: new Date().toISOString(),
      };
      
      addItem(STORAGE_KEYS.COMMENTS, comment);
      setComments(prev => [comment, ...prev]);
      setNewComment('');
    } catch (err) {
      setError('Failed to post comment');
    }
  };
  
  if (!publication || !client) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Publication Not Found</h2>
          <p className="mt-2 text-gray-600">
            The publication you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/publications"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600"
          >
            Browse Publications
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-primary-500 px-6 py-8 text-white">
            <h1 className="text-2xl font-bold mb-2">{publication.title}</h1>
            <div className="flex items-center">
              <div className="bg-white text-primary-500 h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold">
                {client.firstName.charAt(0)}{client.lastName.charAt(0)}
              </div>
              <div className="ml-3">
                <p className="font-medium">
                  {client.firstName} {client.lastName}
                </p>
                <div className="flex items-center text-primary-100 text-sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{client.region}</span>
                </div>
              </div>
              <div className="ml-auto text-sm text-primary-100">
                Posted {new Date(publication.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="md:col-span-2 space-y-6">
                {publication.imageUrl && (
                  <img
                    src={publication.imageUrl}
                    alt={publication.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                )}
                
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                  <p className="text-gray-600 whitespace-pre-wrap">{publication.description}</p>
                </div>
                
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Comments</h2>
                  
                  {user && (
                    <div className="mb-6">
                      <textarea
                        placeholder="Leave a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        rows={3}
                      />
                      {error && (
                        <p className="mt-1 text-sm text-error-500">{error}</p>
                      )}
                      <div className="mt-2 flex justify-end">
                        <button
                          onClick={handleSubmitComment}
                          disabled={!newComment.trim()}
                          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                        >
                          Post Comment
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    {comments.map(comment => {
                      const author = retrieveData<User[]>(STORAGE_KEYS.USERS, [])
                        .find(u => u.id === comment.authorId);
                      
                      return (
                        <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                          <div className="flex items-center mb-2">
                            <div className="bg-primary-100 text-primary-800 h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium">
                              {author?.firstName.charAt(0)}{author?.lastName.charAt(0)}
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">
                                {author?.firstName} {author?.lastName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <p className="text-gray-600">{comment.content}</p>
                        </div>
                      );
                    })}
                    
                    {comments.length === 0 && (
                      <p className="text-gray-500 text-center py-4">
                        No comments yet. Be the first to comment!
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Link
                      to={`/messages/new/${client.id}`}
                      className="block w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 text-center"
                    >
                      <MessageSquare className="inline-block h-4 w-4 mr-2" />
                      Contact Client
                    </Link>
                    {user?.role === 'Technician' && (
                      <Link
                        to={`/proposals/new/${publication.id}`}
                        className="block w-full px-4 py-2 border border-primary-500 rounded-md text-sm font-medium text-primary-500 hover:bg-primary-50 text-center"
                      >
                        <Calendar className="inline-block h-4 w-4 mr-2" />
                        Submit Proposal
                      </Link>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <UserIcon className="h-4 w-4 mr-2" />
                      <span>{client.firstName} {client.lastName}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{client.region}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      <span>{client.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicationDetails;