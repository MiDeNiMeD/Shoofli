import React, { useState, useEffect } from 'react';
import { Publication } from '../models/types';
import PublicationCard from '../components/common/PublicationCard';
import { retrieveData, STORAGE_KEYS } from '../services/storageService';
import { Search, PenTool as Tool } from 'lucide-react';
import { Link } from 'react-router-dom';

const Publications: React.FC = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const allPublications = retrieveData<Publication[]>(STORAGE_KEYS.PUBLICATIONS, [])
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setPublications(allPublications);
  }, []);
  
  const filteredPublications = publications.filter(pub =>
    pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pub.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Publications</h1>
            <p className="mt-2 text-lg text-gray-600">
              Browse service requests from clients
            </p>
          </div>
          
          <Link
            to="/post-publication"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Tool className="h-5 w-5 mr-2" />
            Post Publication
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search publications..."
              className="pl-10 w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPublications.map(publication => (
            <PublicationCard key={publication.id} publication={publication} />
          ))}
          
          {filteredPublications.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Tool className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No publications found</h3>
              <p className="mt-1 text-gray-500">
                Be the first to post a publication
              </p>
              <Link
                to="/post-publication"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600"
              >
                Post Publication
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Publications;