import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { TAGS } from '@/types/news';
import { loginUser, registerUser } from '@/services/api';

export default function AccountPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      await loginUser(formData.email, formData.password);
      setIsLoggedIn(true);
    } catch (error: any) {
      setErrorMessage(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle registration submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      await registerUser(formData.email, formData.password);
      // Auto-login after successful registration
      setActiveTab('login');
      setFormData(prev => ({ ...prev, password: '' }));
    } catch (error: any) {
      setErrorMessage(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mock user preferences for the demo
  const userPreferences = {
    name: 'Demo User',
    email: 'demo@example.com',
    favoriteTopics: ['TECHNOLOGY', 'POLITICS', 'HUMOR'],
  };
  
  // Mock recommended topics based on reading history
  const recommendedTopics = ['ARTIFICIAL_INTELLIGENCE', 'SCIENCE', 'CULTURE'];
  
  return (
    <div className="space-y-12">
      <section className="py-6">
        <h1 className="text-4xl font-bold mb-2">
          <TextGenerateEffect words="Your Account" />
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          Manage your Integrity News preferences and settings
        </p>
      </section>
      
      {isLoggedIn ? (
        <>
          {/* User profile section */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Manage your personal details and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Name</h3>
                    <p className="text-muted-foreground">{userPreferences.name}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-muted-foreground">{userPreferences.email}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Update Profile</Button>
              </CardFooter>
            </Card>
          </section>
          
          <Separator />
          
          {/* Topics preferences */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Topic Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Favorite Topics</CardTitle>
                  <CardDescription>Topics you've shown interest in</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {userPreferences.favoriteTopics.map(topic => (
                      <span 
                        key={topic} 
                        className="text-xs font-medium px-3 py-1.5 rounded-md bg-primary text-primary-foreground"
                      >
                        {topic.toLowerCase().replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Topics</CardTitle>
                  <CardDescription>Topics we think you might enjoy</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {recommendedTopics.map(topic => (
                      <span 
                        key={topic} 
                        className="text-xs font-medium px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground"
                      >
                        {topic.toLowerCase().replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
          
          <Separator />
          
          {/* All available topics */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Explore More Topics</h2>
            <p className="text-muted-foreground mb-6">
              Select topics you're interested in to get more personalized content
            </p>
            <div className="flex flex-wrap gap-2">
              {TAGS.map(tag => (
                <Button 
                  key={tag} 
                  variant={userPreferences.favoriteTopics.includes(tag) ? "default" : "outline"} 
                  size="sm"
                  className="text-xs"
                >
                  {tag.toLowerCase().replace('_', ' ')}
                </Button>
              ))}
            </div>
          </section>
          
          <Separator />
          
          {/* Logout button */}
          <section className="flex justify-center">
            <Button variant="outline" onClick={() => setIsLoggedIn(false)}>
              Log Out
            </Button>
          </section>
        </>
      ) : (
        <section>
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>
                {activeTab === 'login' ? 'Log In' : 'Create Account'}
              </CardTitle>
              <CardDescription>
                {activeTab === 'login' 
                  ? 'Enter your credentials to access your account' 
                  : 'Sign up to personalize your news experience'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-6">
                <Button 
                  variant={activeTab === 'login' ? "default" : "outline"} 
                  onClick={() => setActiveTab('login')}
                  className="flex-1"
                >
                  Log In
                </Button>
                <Button 
                  variant={activeTab === 'register' ? "default" : "outline"} 
                  onClick={() => setActiveTab('register')}
                  className="flex-1"
                >
                  Register
                </Button>
              </div>
              
              <form onSubmit={activeTab === 'login' ? handleLogin : handleRegister}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="password">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="••••••••"
                    />
                  </div>
                  
                  {errorMessage && (
                    <p className="text-red-500 text-sm">{errorMessage}</p>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : activeTab === 'login' ? 'Log In' : 'Create Account'}
                  </Button>
                  
                  {/* Demo mode button */}
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => setIsLoggedIn(true)}
                  >
                    Demo Mode (Skip Login)
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}
