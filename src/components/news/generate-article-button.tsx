import { useState } from 'react';
import { Button } from '@/components/ui/button';
import StatusModal from '@/components/ui/status-modal';
import { createArticle } from '@/services/api';

interface GenerateArticleButtonProps {
  onSuccess?: () => void;
  className?: string;
}

export default function GenerateArticleButton({ onSuccess, className }: GenerateArticleButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    status: 'loading' | 'success' | 'error';
    message: string;
    details?: string;
  }>({
    isOpen: false,
    status: 'loading',
    message: '',
  });

  // API key for article generation - this needs to be a valid UUID that exists in the backend's api_keys table
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'cf1e8de7-4ad6-43cb-bdd3-97405b64891e';

  const handleGenerateArticle = async () => {
    setIsLoading(true);
    setModalState({
      isOpen: true,
      status: 'loading',
      message: 'AI is generating a new satirical news article. This might take a minute...'
    });
    
    try {
      console.log("Using API Key:", API_KEY);
      const result = await createArticle(API_KEY);
      
      if (result.success) {
        setModalState({
          isOpen: true,
          status: 'success',
          message: 'New article created successfully! Refresh the page to see it.'
        });
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setModalState({
          isOpen: true,
          status: 'error',
          message: result.message || 'Failed to create article',
          details: `Server responded with error: ${JSON.stringify(result)}`
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      console.error("Article generation error:", errorMessage);
      
      // Provide more helpful context for common errors
      let userMessage = errorMessage;
      if (errorMessage.includes('404')) {
        userMessage = 'The article generation endpoint was not found. Please ensure the backend server is running correctly at ' + 
          process.env.NEXT_PUBLIC_API_URL + ' and has the /create-articles endpoint available.';
      } else if (errorMessage.includes('400')) {
        userMessage = 'Invalid API key format. The API key must be a valid UUID.';
      } else if (errorMessage.includes('401')) {
        userMessage = 'Invalid API key. The provided API key is not authorized.';
      } else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('Network Error')) {
        userMessage = 'Could not connect to the backend server. Please make sure it is running at ' + 
          process.env.NEXT_PUBLIC_API_URL;
      }
      
      setModalState({
        isOpen: true,
        status: 'error',
        message: userMessage,
        details: `Error details: ${JSON.stringify(err, null, 2)}\n\nAPI Key: ${API_KEY}\nAPI URL: ${process.env.NEXT_PUBLIC_API_URL}/create-articles`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <>
      <div className={className}>
        <Button 
          onClick={handleGenerateArticle} 
          disabled={isLoading}
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold"
          size="lg"
        >
          {isLoading ? 'Generating...' : 'Generate New Article with AI'}
        </Button>
      </div>
      
      <StatusModal
        isOpen={modalState.isOpen}
        status={modalState.status}
        message={modalState.message}
        details={modalState.details}
        onClose={closeModal}
      />
    </>
  );
}
