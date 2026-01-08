import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import Modal from 'web-check-live/components/Form/Modal';
import Button from 'web-check-live/components/Form/Button';
import Input from 'web-check-live/components/Form/Input';
import Heading from 'web-check-live/components/Form/Heading';
import colors from 'web-check-live/styles/colors';
import { toast } from 'react-toastify';
import { EXPLANATION_TEMPLATES, Template } from '../../utils/explanationTemplates';

const Select = styled.select`
  width: 100%;
  background: ${colors.backgroundLighter};
  color: ${colors.textColor};
  border: 1px solid ${colors.primaryTransparent};
  padding: 0.5rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  &:focus { outline: none; border-color: ${colors.primary}; }
`;

const OutputArea = styled.textarea`
  width: 100%;
  height: 150px;
  background: ${colors.background};
  color: ${colors.textColor};
  border: 1px solid ${colors.primaryTransparent};
  border-radius: 4px;
  padding: 0.5rem;
  font-family: monospace;
  margin-top: 1rem;
  resize: vertical;
`;

const VariableInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  label { font-size: 0.9rem; color: ${colors.primary}; }
`;

interface ExplanationGeneratorProps {
  isOpen: boolean;
  closeModal: () => void;
}

const ExplanationGenerator: React.FC<ExplanationGeneratorProps> = ({ isOpen, closeModal }) => {
  const [category, setCategory] = useState<string>('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [variables, setVariables] = useState<{[key: string]: string}>({});
  const [output, setOutput] = useState('');

  const categories = Array.from(new Set(EXPLANATION_TEMPLATES.map(t => t.category)));
  const templates = EXPLANATION_TEMPLATES.filter(t => t.category === category);
  const selectedTemplate = EXPLANATION_TEMPLATES.find(t => t.id === selectedTemplateId);

  useEffect(() => {
    if (categories.length > 0 && !category) setCategory(categories[0]);
  }, []);

  useEffect(() => {
    if (templates.length > 0) setSelectedTemplateId(templates[0].id);
    else setSelectedTemplateId('');
  }, [category]);

  useEffect(() => {
    if (selectedTemplate) {
      const initialVars: any = {};
      selectedTemplate.variables.forEach(v => initialVars[v] = '');
      setVariables(initialVars);
      generate(selectedTemplate, initialVars);
    }
  }, [selectedTemplateId]);

  const generate = (template: Template, vars: any) => {
    let text = template.template;
    Object.keys(vars).forEach(key => {
      text = text.replace(new RegExp(`{{${key}}}`, 'g'), vars[key] || `[${key}]`);
    });
    setOutput(text);
  };

  const handleVarChange = (key: string, value: string) => {
    const newVars = { ...variables, [key]: value };
    setVariables(newVars);
    if (selectedTemplate) generate(selectedTemplate, newVars);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast.success('Copied to clipboard!');
  };

  return (
    <Modal isOpen={isOpen} closeModal={closeModal}>
      <Heading size="medium">Explanation Generator</Heading>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label>Category</label>
          <Select value={category} onChange={e => setCategory(e.target.value)}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
        </div>
        <div>
          <label>Issue</label>
          <Select value={selectedTemplateId} onChange={e => setSelectedTemplateId(e.target.value)}>
            {templates.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
          </Select>
        </div>
      </div>

      {selectedTemplate && selectedTemplate.variables.length > 0 && (
        <VariableInputGroup>
          {selectedTemplate.variables.map(v => (
            <div key={v}>
              <label>{v.replace(/_/g, ' ').toUpperCase()}</label>
              <Input 
                value={variables[v]} 
                onChange={(e: any) => handleVarChange(v, e.target.value)}
                placeholder={`Enter ${v}...`}
              />
            </div>
          ))}
        </VariableInputGroup>
      )}

      <OutputArea value={output} readOnly />
      
      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
        <Button onClick={copyToClipboard}>Copy to Clipboard</Button>
        <Button onClick={() => setOutput('')} style={{ background: colors.backgroundLighter }}>Clear</Button>
      </div>
    </Modal>
  );
};

export default ExplanationGenerator;
