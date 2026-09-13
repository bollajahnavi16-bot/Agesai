import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { useAnalysis } from '../hooks/useAnalysis';
import { ProjectTree } from '../components/code/ProjectTree';
import { CodeViewer } from '../components/code/CodeViewer';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { apiService } from '../services/api';
import { FileItem, FileContent } from '../types';

export const ProjectFiles: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { findings } = useAnalysis(id);

  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<FileContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [fileLoading, setFileLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    apiService.getProjectFiles(id)
      .then(res => {
        setFiles(res);
        if (res.length > 0) {
          const firstPy = res.find(f => f.extension === '.py') || res[0];
          setSelectedFile(firstPy.path);
        }
      })
      .catch(() => setFiles([]))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id || !selectedFile) return;
    setFileLoading(true);
    apiService.getFileContent(id, selectedFile)
      .then(res => setFileContent(res))
      .catch(() => setFileContent(null))
      .finally(() => setFileLoading(false));
  }, [id, selectedFile]);

  if (loading) {
    return (
      <PageContainer title="File Explorer">
        <LoadingSpinner label="Loading project directory tree..." />
      </PageContainer>
    );
  }

  if (files.length === 0) {
    return (
      <PageContainer title="File Explorer">
        <EmptyState
          title="No Files Found"
          description="Upload a ZIP archive or run analysis to populate the project file tree."
        />
      </PageContainer>
    );
  }

  const fileFindings = findings.filter(f => f.file_path === selectedFile);

  return (
    <PageContainer title="File Explorer">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[720px]">
        <div className="lg:col-span-1 h-full">
          <ProjectTree
            files={files}
            selectedFile={selectedFile}
            onSelectFile={setSelectedFile}
          />
        </div>

        <div className="lg:col-span-3 h-full">
          {fileLoading ? (
            <LoadingSpinner label="Parsing file AST source code..." />
          ) : fileContent && selectedFile ? (
            <CodeViewer
              filePath={selectedFile}
              content={fileContent.content}
              findings={fileFindings}
            />
          ) : (
            <EmptyState title="Select a file to inspect" description="Click any file on the left tree to inspect source code and inline AST findings." />
          )}
        </div>
      </div>
    </PageContainer>
  );
};
