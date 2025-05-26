import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Menu, X, ExternalLink, Play, ChevronDown, MessageCircle } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

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
    whatsappProdutora?: string;
  };
  sections: SectionData[];
}

const Index = () => {
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

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

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
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
  const supportersSection = visibleSections.find(s => s.id === 'supporters');
  const supportSection = visibleSections.find(s => s.id === 'support');
  const contactSection = visibleSections.find(s => s.id === 'contact');

  // Define project submenu items
  const projectSubmenus = [
    { id: 'justification', title: 'Justificativa', section: justificationSection },
    { id: 'objectives', title: 'Objetivos', section: objectivesSection },
    { id: 'teasers', title: 'Teasers', section: teasersSection },
    { id: 'team', title: 'Equipe', section: teamSection }
  ].filter(item => item.section);

  // Prepare lightbox slides from gallery images
  const lightboxSlides = teasersSection?.content.galleryImages.map((image: string) => ({
    src: image
  })) || [];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/90 backdrop-blur-sm z-50 border-b border-green-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/32567fc9-b483-4933-93c5-fd9d2726f511.png" 
                alt="COSMO" 
                className="h-8 w-auto"
              />
              <div className="text-xl font-bold text-green-400">
                {data?.globalSettings.siteTitle}
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {heroSection && (
                <button
                  onClick={() => scrollToSection('hero')}
                  className="text-gray-300 hover:text-green-400 transition-colors duration-200 font-medium"
                >
                  Início
                </button>
              )}
              
              {projectSection && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center text-gray-300 hover:text-green-400 transition-colors duration-200 font-medium">
                      O Projeto
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-black border-green-800">
                    <DropdownMenuItem
                      onClick={() => scrollToSection('project')}
                      className="text-gray-300 hover:text-green-400 focus:text-green-400"
                    >
                      Visão Geral
                    </DropdownMenuItem>
                    {projectSubmenus.map(item => (
                      <DropdownMenuItem
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className="text-gray-300 hover:text-green-400 focus:text-green-400"
                      >
                        {item.title}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              
              {supportersSection && (
                <button
                  onClick={() => scrollToSection('supporters')}
                  className="text-gray-300 hover:text-green-400 transition-colors duration-200 font-medium"
                >
                  {supportersSection.menuTitle}
                </button>
              )}
              
              {supportSection && (
                <button
                  onClick={() => scrollToSection('support')}
                  className="text-gray-300 hover:text-green-400 transition-colors duration-200 font-medium"
                >
                  {supportSection.menuTitle}
                </button>
              )}
              
              {contactSection && (
                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-gray-300 hover:text-green-400 transition-colors duration-200 font-medium"
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
              <SheetContent side="right" className="bg-black border-green-800">
                <div className="flex flex-col space-y-4 mt-8">
                  {heroSection && (
                    <button
                      onClick={() => scrollToSection('hero')}
                      className="text-left text-gray-300 hover:text-green-400 transition-colors duration-200 text-lg"
                    >
                      Início
                    </button>
                  )}
                  
                  {projectSection && (
                    <>
                      <button
                        onClick={() => scrollToSection('project')}
                        className="text-left text-gray-300 hover:text-green-400 transition-colors duration-200 text-lg font-medium"
                      >
                        O Projeto
                      </button>
                      <div className="ml-4 space-y-2">
                        {projectSubmenus.map(item => (
                          <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className="block text-left text-gray-400 hover:text-green-400 transition-colors duration-200"
                          >
                            {item.title}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                  
                  {supportersSection && (
                    <button
                      onClick={() => scrollToSection('supporters')}
                      className="text-left text-gray-300 hover:text-green-400 transition-colors duration-200 text-lg"
                    >
                      {supportersSection.menuTitle}
                    </button>
                  )}
                  
                  {supportSection && (
                    <button
                      onClick={() => scrollToSection('support')}
                      className="text-left text-gray-300 hover:text-green-400 transition-colors duration-200 text-lg"
                    >
                      {supportSection.menuTitle}
                    </button>
                  )}
                  
                  {contactSection && (
                    <button
                      onClick={() => scrollToSection('contact')}
                      className="text-left text-gray-300 hover:text-green-400 transition-colors duration-200 text-lg"
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
              backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://aventufilm.com.br/wp-content/uploads/2025/05/Teaser-2.00_01_02_21.Still001.jpg)`
            }}
          />
          <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-green-400">
              {heroSection.content.mainTitle}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
              {heroSection.content.logline}
            </p>
            <Button
              onClick={() => scrollToSection('project')}
              className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg px-8 py-4 rounded-lg transition-colors duration-200"
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
              backgroundImage: `url(https://aventufilm.com.br/wp-content/uploads/2025/05/DSC06270.jpg)`
            }}
          />
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-green-400">
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
              backgroundImage: `url(https://ihttps://aventufilm.com.br/wp-content/uploads/2025/05/Teaser-2.00_00_11_06.Still003.jpgmgdrop.io/image/Teaser-%232.00-00-11-06.Still003.mj4JU)`
            }}
          />
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-green-400">
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
                  style={{ 
              backgroundImage: `url(https://aventufilm.com.br/wp-content/uploads/2025/05/Teaser-2.00_00_38_10.Still002.jpg)`}}
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
              backgroundImage: `url(https://aventufilm.com.br/wp-content/uploads/2025/05/Teaser-2.00_00_38_10.Still002.jpg)`
            }}
          />
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-green-400">
              {teasersSection.title}
            </h2>
            
            <div className="grid md:grid-cols-1 gap-8 mb-16">
              <div className="aspect-video">
                <iframe
                  src={teasersSection.content.teaser1Url}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                />
                <h3 className="text-center mt-4 text-green-400 font-semibold">Teaser #1</h3>
              </div>
              <div className="aspect-video">
                <iframe
                  src={teasersSection.content.teaser2Url}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                />
                <h3 className="text-center mt-4 text-green-400 font-semibold">Teaser #2</h3>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {teasersSection.content.galleryImages.map((image: string, index: number) => (
                <img
                  key={index}
                  src={image}
                  alt={`Galeria ${index + 1}`}
                  className="w-full aspect-square object-cover rounded-lg hover:scale-105 transition-transform duration-200 cursor-pointer border-2 border-transparent hover:border-green-400"
                  onClick={() => openLightbox(index)}
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
              backgroundImage: `url(https://aventufilm.com.br/wp-content/uploads/2025/05/DSC07433.jpg)`
            }}
          />
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-green-400">
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
              backgroundImage: `url(https://aventufilm.com.br/wp-content/uploads/2025/05/DSC06317.jpg)`
            }}
          />
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-green-400">
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

      {/* Supporters Section */}
      {supportersSection && (
        <section id="supporters" className="py-20 bg-black relative">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
            style={{ 
              backgroundImage: `url(https://aventufilm.com.br/wp-content/uploads/2025/05/DSC06293.jpg)`
            }}
          />
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-green-400">
              {supportersSection.title}
            </h2>
            
            <p className="text-xl text-gray-300 text-center mb-12 leading-relaxed">
              {supportersSection.content.explanatoryText}
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {supportersSection.content.supporters.map((supporter: any, index: number) => (
                <Card key={index} className="bg-gray-800/80 border-green-800 p-6 text-center">
                  <img
                    src={supporter.logo}
                    alt={supporter.name}
                    className="w-48 h-24 mx-auto mb-4 object-contain"
                  />
                  <h3 className="text-xl font-bold text-green-400 mb-3">
                    {supporter.name}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {supporter.description}
                  </p>
                </Card>
              ))}
            </div>
            
            <div className="text-center">
              <Button
                asChild
                className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg px-8 py-4 rounded-lg transition-colors duration-200"
              >
                <a href={supportersSection.content.whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Quero Apoiar!
                </a>
              </Button>
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
              backgroundImage: `url(https://aventufilm.com.br/wp-content/uploads/2025/05/DSC06293.jpg)`
            }}
          />
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-green-400">
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
              backgroundImage: `url(https://aventufilm.com.br/wp-content/uploads/2025/05/DSC06344.jpg)`
            }}
          />
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-green-400">
              {contactSection.title}
            </h2>
            
            <Card className="bg-black/80 border-green-800 p-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                {contactSection.content.name}
              </h3>
              <p className="text-green-500 font-medium mb-4">
                {contactSection.content.role}
              </p>
              <div className="space-y-3">
                <p className="text-gray-300">
                  Email: <a href={`mailto:${contactSection.content.email}`} className="text-green-400 hover:underline">
                    {contactSection.content.email}
                  </a>
                </p>
                <p className="text-gray-300">
                  WhatsApp: <a href={contactSection.content.whatsappLink} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
                    {contactSection.content.whatsapp}
                  </a>
                </p>
                <p className="text-gray-300">
                  Website: <a href={contactSection.content.website} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
                    {contactSection.content.website}
                  </a>
                </p>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-black border-t border-green-800 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-center md:text-left">
              Copyright © {new Date().getFullYear()} Guardiões do Marumbi / AventuFilm. Todos os direitos reservados.
            </p>
            {data?.globalSettings.whatsappProdutora && (
              <Button
                asChild
                variant="outline"
                className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
              >
                <a href={data.globalSettings.whatsappProdutora} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp AventuFilm
                </a>
              </Button>
            )}
          </div>
        </div>
      </footer>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={lightboxSlides}
      />
    </div>
  );
};

export default Index;
