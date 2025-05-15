import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WavyBackground } from '@/components/ui/wavy-background';
import { Separator } from '@/components/ui/separator';

export default function AboutPage() {
  return (
    <div className="space-y-12">
      {/* Hero section */}
      <section className="py-6">
        <h1 className="text-4xl font-bold mb-2">
          <TextGenerateEffect words="About Integrity News" />
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          Our mission is to deliver satirical AI-powered news that entertains and provokes thought
        </p>
        
        <div className="relative w-full h-[300px] overflow-hidden rounded-xl">
          <WavyBackground className="w-full h-full absolute inset-0">
            <div className="relative z-10 flex flex-col justify-center items-center h-full w-full px-6 md:px-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Truth with a Twist
              </h2>
              <p className="text-white/80 max-w-2xl">
                At Integrity News, we believe that sometimes the best way to understand reality is through the lens of satire.
                Our AI-powered platform creates content that's both entertaining and thought-provoking.
              </p>
            </div>
          </WavyBackground>
        </div>
      </section>
      
      <Separator />
      
      {/* About section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Our Story</CardTitle>
            <CardDescription>How Integrity News came to be</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Integrity News was born from a simple idea: in a world of sensationalist headlines and clickbait, 
              what if we could create a news platform that was entertaining, but also made people think critically 
              about the media they consume?
            </p>
            <p className="text-muted-foreground mt-4">
              Using cutting-edge AI technology, we create satirical news articles that highlight the absurdities and 
              contradictions in contemporary news coverage, all while maintaining a commitment to factual integrity.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Our Technology</CardTitle>
            <CardDescription>How we create our content</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Integrity News uses advanced AI models to analyze real news stories and create satirical versions that 
              highlight inconsistencies, hyperbole, and societal contradictions.
            </p>
            <p className="text-muted-foreground mt-4">
              Our platform is built on a combination of Next.js, Supabase, and Google's Gemini AI model, allowing us to 
              generate content that's not only funny but also insightful and relevant.
            </p>
          </CardContent>
        </Card>
      </section>
      
      <Separator />
      
      {/* Team section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Content Team</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our AI models work tirelessly to analyze news trends and create satirical content that challenges 
                conventional perspectives.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Human Editors</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our human editors ensure that all AI-generated content meets our standards for quality, humor, and insight.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Development Team</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our developers work on creating a seamless user experience and continually improving our AI models.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
