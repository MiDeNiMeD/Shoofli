import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Technician, Publication } from '../models/types';
import TechnicianCard from '../components/common/TechnicianCard';
import PublicationCard from '../components/common/PublicationCard';
import { retrieveData, STORAGE_KEYS } from '../services/storageService';
import { ArrowRight, Search, PenTool as Tool, MessageSquare, Star, Shield } from 'lucide-react';

const Home: React.FC = () => {
  const [featuredTechnicians, setFeaturedTechnicians] = useState<Technician[]>([]);
  const [recentPublications, setRecentPublications] = useState<Publication[]>([]);
  
  useEffect(() => {
    // Get all approved technicians and sort by rating
    const technicians = retrieveData<Technician[]>(STORAGE_KEYS.TECHNICIANS, [])
      .filter(tech => tech.isApproved)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3); // Get top 3
    
    setFeaturedTechnicians(technicians);
    
    // Get recent publications
    const publications = retrieveData<Publication[]>(STORAGE_KEYS.PUBLICATIONS, [])
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3); // Get 3 most recent
    
    setRecentPublications(publications);
  }, []);
  
  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Find the Right Technician for Any Job
              </h1>
              <p className="mt-4 text-lg md:text-xl text-primary-100">
                Shoofli connects you with skilled local technicians for all your needs. Post a job or browse available services.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                >
                  Get Started
                </Link>
                <Link
                  to="/technicians"
                  className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                >
                  Browse Technicians
                </Link>
              </div>
            </div>
            <div className="hidden md:block md:w-1/2 mt-10 md:mt-0">
              <img
                className="mx-auto"
                src="https://images.pexels.com/photos/8961491/pexels-photo-8961491.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="Technician"
                style={{ borderRadius: '12px', maxHeight: '400px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* How it works section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">How Shoofli Works</h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Get your technical needs met in three simple steps
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-full mb-4">
                <Search className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900">Find a Technician</h3>
              <p className="mt-2 text-gray-600">
                Browse our directory of skilled technicians or post your specific need.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-full mb-4">
                <MessageSquare className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900">Connect and Discuss</h3>
              <p className="mt-2 text-gray-600">
                Chat with technicians, discuss your needs, and agree on terms.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-full mb-4">
                <Star className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900">Get the Job Done</h3>
              <p className="mt-2 text-gray-600">
                Receive quality service and leave a review to help others.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured technicians section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Featured Technicians</h2>
            <Link to="/technicians" className="text-primary-500 hover:text-primary-600 flex items-center">
              View all <ArrowRight className="ml-1 h-5 w-5" />
            </Link>
          </div>
          
          {featuredTechnicians.length > 0 ? (
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              {featuredTechnicians.map(technician => (
                <TechnicianCard key={technician.id} technician={technician} />
              ))}
            </div>
          ) : (
            <div className="mt-8 bg-gray-50 p-8 rounded-lg text-center">
              <Tool className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No technicians yet</h3>
              <p className="mt-1 text-gray-500">
                Be the first to register as a technician and offer your services.
              </p>
              <div className="mt-6">
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600"
                >
                  Register Now
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent publications section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Recent Publications</h2>
            <Link to="/publications" className="text-primary-500 hover:text-primary-600 flex items-center">
              View all <ArrowRight className="ml-1 h-5 w-5" />
            </Link>
          </div>
          
          {recentPublications.length > 0 ? (
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              {recentPublications.map(publication => (
                <PublicationCard key={publication.id} publication={publication} />
              ))}
            </div>
          ) : (
            <div className="mt-8 bg-white p-8 rounded-lg text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No publications yet</h3>
              <p className="mt-1 text-gray-500">
                Be the first to post a publication and get help from local technicians.
              </p>
              <div className="mt-6">
                <Link
                  to="/post-publication"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-secondary-500 hover:bg-secondary-600"
                >
                  Post a Publication
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Testimonials or trust section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Why Choose Shoofli</h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              We're committed to connecting you with the best local talent
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-full mb-4">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900">Verified Professionals</h3>
              <p className="mt-2 text-gray-600">
                All technicians are verified and approved by our administrators
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-full mb-4">
                <Star className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900">Quality Ratings</h3>
              <p className="mt-2 text-gray-600">
                Transparent rating system helps you choose the best professionals
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-full mb-4">
                <MessageSquare className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900">Direct Communication</h3>
              <p className="mt-2 text-gray-600">
                Chat directly with technicians to explain your needs clearly
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link
              to="/register"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Join Shoofli Today
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;