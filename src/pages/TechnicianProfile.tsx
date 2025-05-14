import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Technician, Comment } from '../models/types';
import { retrieveData, STORAGE_KEYS, addItem } from '../services/storageService';
import { useAuth } from '../contexts/AuthContext';
import { Star, MapPin, PenTool, MessageSquare, Calendar, DollarSign } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const TechnicianProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [technician, setTechnician] = useState<Technician | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (id) {
      const tech = retrieveData<Technician[]>(STORAGE_KEYS.TECHNICIANS, [])
        .find(t => t.id === id);
      setTechnician(tech || null);
      
      const techComments = retrieveData<Comment[]>(STORAGE_KEYS.COMMENTS, [])
        .filter(c => c.targetId === id && c.targetType === 'Technician')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setComments(techComments);
    }
  }, [id]);
  
  const handleSubmitComment = () => {
    if (!user || !technician || !newComment.trim()) return;
    
    try {
      const comment: Comment = {
        id: uuidv4(),
        content: newComment.trim(),
        authorId: user.id,
        targetId: technician.id,
        targetType: 'Technician',
        createdAt: new Date().toISOString(),
      };
      
      addItem(STORAGE_KEYS.COMMENTS, comment);
      setComments(prev => [comment, ...prev]);
      setNewComment('');
    } catch (err) {
      setError('Failed to post comment');
    }
  };
  
  if (!technician) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Technician Not Found</h2>
          <p className="mt-2 text-gray-600">
            The technician you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/technicians"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600"
          >
            Browse Technicians
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
            <div className="flex items-center">
              <div className="bg-white text-primary-500 h-20 w-20 rounded-full flex items-center justify-center text-2xl font-bold">
                {technician.firstName.charAt(0)}{technician.lastName.charAt(0)}
              </div>
              <div className="ml-6">
                <h1 className="text-2xl font-bold">
                  {technician.firstName} {technician.lastName}
                </h1>
                <p className="text-primary-100">{technician.specialty}</p>
                <div className="flex items-center mt-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{technician.region}</span>
                </div>
              </div>
              <div className="ml-auto text-right">
                <div className="flex items-center justify-end mb-2">
                  <Star className="h-5 w-5 text-yellow-400 mr-1" />
                  <span className="font-semibold text-lg">{technician.rating.toFixed(1)}</span>
                </div>
                <p className="text-2xl font-bold">${technician.pricePerService.toFixed(2)}</p>
                <p className="text-sm text-primary-100">per service</p>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main Info */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">About</h2>
                  <p className="text-gray-600">{technician.bio}</p>
                </div>
                
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Reviews & Comments</h2>
                  
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
                      const author = retrieveData<Technician[]>(STORAGE_KEYS.USERS, [])
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
                        No comments yet. Be the first to leave a review!
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
                      to={`/messages/new/${technician.id}`}
                      className="block w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 text-center"
                    >
                      <MessageSquare className="inline-block h-4 w-4 mr-2" />
                      Contact
                    </Link>
                    <Link
                      to={`/book/${technician.id}`}
                      className="block w-full px-4 py-2 border border-primary-500 rounded-md text-sm font-medium text-primary-500 hover:bg-primary-50 text-center"
                    >
                      <Calendar className="inline-block h-4 w-4 mr-2" />
                      Book Service
                    </Link>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Specialties</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <PenTool className="h-4 w-4 mr-2" />
                      <span>{technician.specialty}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span>${technician.pricePerService.toFixed(2)} per service</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{technician.region}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      <span>{technician.email}</span>
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

export default TechnicianProfile;