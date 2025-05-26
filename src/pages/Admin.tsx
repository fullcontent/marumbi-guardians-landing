
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Save, Download } from 'lucide-react';

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

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const ADMIN_PASSWORD = 'guardioes2024'; // In production, this should be more secure

  useEffect(() => {
    if (authenticated) {
      loadData();
    }
  }, [authenticated]);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao painel administrativo",
      });
    } else {
      toast({
        title: "Senha incorreta",
        description: "Tente novamente",
        variant: "destructive",
      });
    }
  };

  const loadData = async () => {
    try {
      const response = await fetch('/data.json');
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados do site",
        variant: "destructive",
      });
    }
  };

  const handleSave = () => {
    if (!data) return;
    
    // Create a downloadable JSON file
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Dados salvos",
      description: "O arquivo data.json foi baixado. Faça o upload para o servidor.",
    });
  };

  const updateGlobalSetting = (key: string, value: string) => {
    if (!data) return;
    setData({
      ...data,
      globalSettings: {
        ...data.globalSettings,
        [key]: value,
      },
    });
  };

  const updateSectionVisibility = (sectionId: string, visible: boolean) => {
    if (!data) return;
    setData({
      ...data,
      sections: data.sections.map(section =>
        section.id === sectionId ? { ...section, visible } : section
      ),
    });
  };

  const updateSectionContent = (sectionId: string, field: string, value: any) => {
    if (!data) return;
    setData({
      ...data,
      sections: data.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              content: {
                ...section.content,
                [field]: value,
              },
            }
          : section
      ),
    });
  };

  const updateSectionTitle = (sectionId: string, field: 'title' | 'menuTitle', value: string) => {
    if (!data) return;
    setData({
      ...data,
      sections: data.sections.map(section =>
        section.id === sectionId ? { ...section, [field]: value } : section
      ),
    });
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Admin - Guardiões do Marumbi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <Button onClick={handleLogin} className="w-full">
              Entrar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando dados...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
            <Save className="mr-2 h-4 w-4" />
            Salvar Alterações
          </Button>
        </div>

        {/* Global Settings */}
        <Card className="mb-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Configurações Globais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteTitle">Título do Site</Label>
              <Input
                id="siteTitle"
                value={data.globalSettings.siteTitle}
                onChange={(e) => updateGlobalSetting('siteTitle', e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div>
              <Label htmlFor="contactEmail">Email de Contato</Label>
              <Input
                id="contactEmail"
                value={data.globalSettings.contactEmail}
                onChange={(e) => updateGlobalSetting('contactEmail', e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
            </div>
          </CardContent>
        </Card>

        {/* Sections */}
        <div className="space-y-6">
          {data.sections.map((section) => (
            <Card key={section.id} className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-3">
                    <Checkbox
                      checked={section.visible}
                      onCheckedChange={(checked) => 
                        updateSectionVisibility(section.id, checked as boolean)
                      }
                    />
                    <span>{section.title}</span>
                    {section.visible ? (
                      <Eye className="h-5 w-5 text-green-500" />
                    ) : (
                      <EyeOff className="h-5 w-5 text-red-500" />
                    )}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Título da Seção</Label>
                    <Input
                      value={section.title}
                      onChange={(e) => updateSectionTitle(section.id, 'title', e.target.value)}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                  <div>
                    <Label>Título no Menu</Label>
                    <Input
                      value={section.menuTitle}
                      onChange={(e) => updateSectionTitle(section.id, 'menuTitle', e.target.value)}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                </div>

                <Separator className="bg-gray-600" />

                {/* Section-specific content fields */}
                {section.id === 'hero' && (
                  <div className="space-y-4">
                    <div>
                      <Label>Imagem de Fundo (caminho)</Label>
                      <Input
                        value={section.content.backgroundImage || ''}
                        onChange={(e) => updateSectionContent(section.id, 'backgroundImage', e.target.value)}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                    <div>
                      <Label>Título Principal</Label>
                      <Input
                        value={section.content.mainTitle || ''}
                        onChange={(e) => updateSectionContent(section.id, 'mainTitle', e.target.value)}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                    <div>
                      <Label>Logline</Label>
                      <textarea
                        value={section.content.logline || ''}
                        onChange={(e) => updateSectionContent(section.id, 'logline', e.target.value)}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>Texto do Botão CTA</Label>
                      <Input
                        value={section.content.ctaButtonText || ''}
                        onChange={(e) => updateSectionContent(section.id, 'ctaButtonText', e.target.value)}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                  </div>
                )}

                {section.id === 'project' && (
                  <div className="space-y-4">
                    <div>
                      <Label>Texto Introdutório</Label>
                      <textarea
                        value={section.content.introText || ''}
                        onChange={(e) => updateSectionContent(section.id, 'introText', e.target.value)}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
                        rows={3}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Título "O Que É"</Label>
                        <Input
                          value={section.content.whatIsTitle || ''}
                          onChange={(e) => updateSectionContent(section.id, 'whatIsTitle', e.target.value)}
                          className="bg-gray-700 border-gray-600"
                        />
                      </div>
                      <div>
                        <Label>Título "Formato"</Label>
                        <Input
                          value={section.content.formatTitle || ''}
                          onChange={(e) => updateSectionContent(section.id, 'formatTitle', e.target.value)}
                          className="bg-gray-700 border-gray-600"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Texto "O Que É"</Label>
                        <textarea
                          value={section.content.whatIsText || ''}
                          onChange={(e) => updateSectionContent(section.id, 'whatIsText', e.target.value)}
                          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label>Texto "Formato"</Label>
                        <textarea
                          value={section.content.formatText || ''}
                          onChange={(e) => updateSectionContent(section.id, 'formatText', e.target.value)}
                          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
                          rows={3}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Título dos Temas</Label>
                      <Input
                        value={section.content.themesTitle || ''}
                        onChange={(e) => updateSectionContent(section.id, 'themesTitle', e.target.value)}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                    <div>
                      <Label>Temas (um por linha)</Label>
                      <textarea
                        value={section.content.themes?.join('\n') || ''}
                        onChange={(e) => updateSectionContent(section.id, 'themes', e.target.value.split('\n').filter(line => line.trim()))}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
                        rows={5}
                      />
                    </div>
                    <div>
                      <Label>Imagem 1 (caminho)</Label>
                      <Input
                        value={section.content.image1 || ''}
                        onChange={(e) => updateSectionContent(section.id, 'image1', e.target.value)}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                  </div>
                )}

                {/* Add similar content editing for other sections */}
                {section.id === 'justification' && (
                  <div className="space-y-4">
                    <div>
                      <Label>Texto Principal</Label>
                      <textarea
                        value={section.content.mainText || ''}
                        onChange={(e) => updateSectionContent(section.id, 'mainText', e.target.value)}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
                        rows={5}
                      />
                    </div>
                    <div>
                      <Label>Imagem (caminho)</Label>
                      <Input
                        value={section.content.image || ''}
                        onChange={(e) => updateSectionContent(section.id, 'image', e.target.value)}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                  </div>
                )}

                {section.id === 'support' && (
                  <div className="space-y-4">
                    <div>
                      <Label>Texto Explicativo</Label>
                      <textarea
                        value={section.content.explanatoryText || ''}
                        onChange={(e) => updateSectionContent(section.id, 'explanatoryText', e.target.value)}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label>Texto do Botão de Crowdfunding</Label>
                      <Input
                        value={section.content.crowdfundingButtonText || ''}
                        onChange={(e) => updateSectionContent(section.id, 'crowdfundingButtonText', e.target.value)}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                    <div>
                      <Label>Link do Crowdfunding</Label>
                      <Input
                        value={section.content.crowdfundingLink || ''}
                        onChange={(e) => updateSectionContent(section.id, 'crowdfundingLink', e.target.value)}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                    <div>
                      <Label>Imagem QR Code (caminho)</Label>
                      <Input
                        value={section.content.qrCodeImage || ''}
                        onChange={(e) => updateSectionContent(section.id, 'qrCodeImage', e.target.value)}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 p-4 bg-yellow-900 rounded-lg">
          <h3 className="font-bold mb-2">Instruções:</h3>
          <ul className="text-sm space-y-1">
            <li>• Faça upload das imagens para a pasta /images/ no servidor</li>
            <li>• Use caminhos como "/images/hero-background.jpg" nos campos de imagem</li>
            <li>• Após salvar, faça upload do arquivo data.json para o servidor</li>
            <li>• Use URLs completas do YouTube para os teasers (ex: https://www.youtube.com/embed/...)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Admin;
