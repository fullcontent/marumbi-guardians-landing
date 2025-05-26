import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Menu, X, ExternalLink, Play, ChevronDown } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SectionData {
  id: string;
  title: string;
  visible: boolean;
  menuTitle: string;
  content: any;
}

interface SiteData {
  globalSettings: {
    siteTitle: string;
    contactEmail: string;
  };
  sections: SectionData[];
}

const Index = () => {
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Load data from JSON file
    fetch('/data.json')
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading data:', error);
        setLoading(false);
      });
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Erro ao carregar dados</div>
      </div>
    );
  }

  const visibleSections = data.sections.filter(section => section.visible);
  const heroSection = visibleSections.find(s => s.id === 'hero');
  const projectSection = visibleSections.find(s => s.id === 'project');
  const justificationSection = visibleSections.find(s => s.id === 'justification');
  const teasersSection = visibleSections.find(s => s.id === 'teasers');
  const objectivesSection = visibleSections.find(s => s.id === 'objectives');
  const teamSection = visibleSections.find(s => s.id === 'team');
  const supportSection = visibleSections.find(s => s.id === 'support');
  const contactSection = visibleSections.find(s => s.id === 'contact');

  // Define project submenu items
  const projectSubmenus = [
    { id: 'justification', title: 'Justificativa', section: justificationSection },
    { id: 'objectives', title: 'Objetivos', section: objectivesSection },
    { id: 'teasers', title: 'Teasers', section: teasersSection },
    { id: 'team', title: 'Equipe', section: teamSection }
  ].filter(item => item.section);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/90 backdrop-blur-sm z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/32567fc9-b483-4933-93c5-fd9d2726f511.png" 
                alt="COSMO Logo" 
                className="h-10 w-10"
              />
              <div className="text-xl font-bold text-emerald-400">
                {data.globalSettings.siteTitle}
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {heroSection && (
                <button
                  onClick={() => scrollToSection('hero')}
                  className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 font-medium"
                >
                  Início
                </button>
              )}
              
              {projectSection && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center text-gray-300 hover:text-emerald-400 transition-colors duration-200 font-medium">
                      O Projeto
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-black border-gray-800">
                    <DropdownMenuItem
                      onClick={() => scrollToSection('project')}
                      className="text-gray-300 hover:text-emerald-400 focus:text-emerald-400"
                    >
                      Visão Geral
                    </DropdownMenuItem>
                    {projectSubmenus.map(item => (
                      <DropdownMenuItem
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className="text-gray-300 hover:text-emerald-400 focus:text-emerald-400"
                      >
                        {item.title}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              
              {supportSection && (
                <button
                  onClick={() => scrollToSection('support')}
                  className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 font-medium"
                >
                  {supportSection.menuTitle}
                </button>
              )}
              
              {contactSection && (
                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 font-medium"
                >
                  {contactSection.menuTitle}
                </button>
              )}
            </div>

            {/* Mobile Navigation */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-black border-gray-800">
                <div className="flex flex-col space-y-4 mt-8">
                  {heroSection && (
                    <button
                      onClick={() => scrollToSection('hero')}
                      className="text-left text-gray-300 hover:text-emerald-400 transition-colors duration-200 text-lg"
                    >
                      Início
                    </button>
                  )}
                  
                  {projectSection && (
                    <>
                      <button
                        onClick={() => scrollToSection('project')}
                        className="text-left text-gray-300 hover:text-emerald-400 transition-colors duration-200 text-lg font-medium"
                      >
                        O Projeto
                      </button>
                      <div className="ml-4 space-y-2">
                        {projectSubmenus.map(item => (
                          <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className="block text-left text-gray-400 hover:text-emerald-400 transition-colors duration-200"
                          >
                            {item.title}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                  
                  {supportSection && (
                    <button
                      onClick={() => scrollToSection('support')}
                      className="text-left text-gray-300 hover:text-emerald-400 transition-colors duration-200 text-lg"
                    >
                      {supportSection.menuTitle}
                    </button>
                  )}
                  
                  {contactSection && (
                    <button
                      onClick={() => scrollToSection('contact')}
                      className="text-left text-gray-300 hover:text-emerald-400 transition-colors duration-200 text-lg"
                    >
                      {contactSection.menuTitle}
                    </button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      {heroSection && (
        <section id="hero" className="min-h-screen flex items-center justify-center relative">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80)`
            }}
          />
          <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-emerald-400">
              {heroSection.content.mainTitle}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
              {heroSection.content.logline}
            </p>
            <Button
              onClick={() => scrollToSection('project')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg px-8 py-4 rounded-lg transition-colors duration-200"
            >
              {heroSection.content.ctaButtonText}
            </Button>
          </div>
        </section>
      )}

      {/* Project Section */}
      {projectSection && (
        <section id="project" className="py-20 bg-gray-900 relative">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
            style={{ 
              backgroundImage: `url(https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2052&q=80)`
            }}
          />
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-emerald-400">
              {projectSection.title}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <p className="text-xl text-gray-300 leading-relaxed mb-8">
                  {projectSection.content.introText}
                </p>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-emerald-500 mb-3">
                      {projectSection.content.whatIsTitle}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {projectSection.content.whatIsText}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-emerald-500 mb-3">
                      {projectSection.content.formatTitle}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {projectSection.content.formatText}
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <img
                  src={projectSection.content.image1}
                  alt="Projeto"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
            </div>
            
            <div>
              <h3 className="text-3xl font-bold text-emerald-500 mb-6 text-center">
                {projectSection.content.themesTitle}
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projectSection.content.themes.map((theme: string, index: number) => (
                  <Card key={index} className="bg-black/50 border-emerald-800 p-4">
                    <p className="text-center text-gray-300 font-medium">{theme}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Justification Section */}
      {justificationSection && (
        <section id="justification" className="py-20 bg-black relative">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
            style={{ 
              backgroundImage: `url(https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2062&q=80)`
            }}
          />
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-emerald-400">
              {justificationSection.title}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-xl text-gray-300 leading-relaxed">
                  {justificationSection.content.mainText}
                </p>
              </div>
              <div>
                <img
                  src={justificationSection.content.image}
                  alt="Justificativa"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Teasers Section */}
      {teasersSection && (
        <section id="teasers" className="py-20 bg-gray-900 relative">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
            style={{ 
              backgroundImage: `url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)`
            }}
          />
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-emerald-400">
              {teasersSection.title}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="aspect-video">
                <iframe
                  src={teasersSection.content.teaser1Url}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                />
              </div>
              <div className="aspect-video">
                <iframe
                  src={teasersSection.content.teaser2Url}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {teasersSection.content.galleryImages.map((image: string, index: number) => (
                <img
                  key={index}
                  src={image}
                  alt={`Galeria ${index + 1}`}
                  className="w-full aspect-square object-cover rounded-lg hover:scale-105 transition-transform duration-200 cursor-pointer"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Objectives Section */}
      {objectivesSection && (
        <section id="objectives" className="py-20 bg-black relative">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
            style={{ 
              backgroundImage: `url(https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2048&q=80)`
            }}
          />
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-emerald-400">
              {objectivesSection.title}
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {objectivesSection.content.objectives.map((objective: string, index: number) => (
                <Card key={index} className="bg-gray-800/80 border-emerald-800 p-6 hover:bg-gray-700/80 transition-colors duration-200">
                  <p className="text-gray-300 text-center text-lg font-medium">
                    {objective}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team Section */}
      {teamSection && (
        <section id="team" className="py-20 bg-gray-900 relative">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
            style={{ 
              backgroundImage: `url(https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)`
            }}
          />
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-emerald-400">
              {teamSection.title}
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {teamSection.content.members.map((member: any, index: number) => (
                <Card key={index} className="bg-black/80 border-emerald-800 p-6 text-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-2xl font-bold text-emerald-400 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-emerald-500 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    {member.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Support Section */}
      {supportSection && (
        <section id="support" className="py-20 bg-black relative">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
            style={{ 
              backgroundImage: `url(https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2088&q=80)`
            }}
          />
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-emerald-400">
              {supportSection.title}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-xl text-gray-300 leading-relaxed mb-8">
                  {supportSection.content.explanatoryText}
                </p>
                
                <Button
                  asChild
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg px-8 py-4 rounded-lg transition-colors duration-200 w-full md:w-auto"
                >
                  <a href={supportSection.content.crowdfundingLink} target="_blank" rel="noopener noreferrer">
                    {supportSection.content.crowdfundingButtonText}
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              </div>
              
              <div className="text-center">
                <img
                  src={supportSection.content.qrCodeImage}
                  alt="QR Code Benfeitoria"
                  className="w-64 h-64 mx-auto rounded-lg"
                />
                <p className="text-gray-400 mt-4">Escaneie para apoiar</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      {contactSection && (
        <section id="contact" className="py-20 bg-gray-900 relative">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
            style={{ 
              backgroundImage: `url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)`
            }}
          />
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-emerald-400">
              {contactSection.title}
            </h2>
            
            <Card className="bg-black/80 border-emerald-800 p-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                {contactSection.content.name}
              </h3>
              <p className="text-emerald-500 font-medium mb-4">
                {contactSection.content.role}
              </p>
              <p className="text-gray-300 mb-4">
                Email: <a href={`mailto:${contactSection.content.email}`} className="text-emerald-400 hover:underline">
                  {contactSection.content.email}
                </a>
              </p>
              <p className="text-gray-300">
                Website: <a href={contactSection.content.website} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">
                  {contactSection.content.website}
                </a>
              </p>
            </Card>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            Copyright © {new Date().getFullYear()} Guardiões do Marumbi / AventuFilm. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
