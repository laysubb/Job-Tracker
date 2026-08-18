import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_JOBS } from '../data/seedJobs';
import confetti from 'canvas-confetti';
import { supabase } from '../libs/supabase';

const JobContext = createContext();

const STORAGE_KEY = 'careerpulse_jobs_v1';
const THEME_KEY = 'careerpulse_theme';

export function JobProvider({ children }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    async function fetchJobs(){
      try{
        setLoading(true);
        const{data, error} = await supabase.from('jobs').select('*').order('created_at',{ascending: false});
        if(error) throw error;
        if(data) setJobs(data);

        

      }catch(err){
        console.error("Failed to fetch jobs: ",err.message);

      }finally{
        setLoading(false);
      }

    }
    fetchJobs();
  },[]);
  
  // useState(() => {
  //   try {
  //     const saved = localStorage.getItem(STORAGE_KEY);
  //     if (saved) {
  //       return JSON.parse(saved);
  //     }
  //   } catch (e) {
  //     console.error("Error reading localStorage", e);
  //   }
  //   return INITIAL_JOBS;
  // });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_KEY) || 'dark';
  });

  const [activeTab, setActiveTab] = useState('kanban'); // 'kanban' | 'table' | 'sankey' | 'reminders'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedProgram, setSelectedProgram] = useState('All Programs');
  const [editingJob, setEditingJob] = useState(null); // null = modal closed, {} = new job, { ... } = edit
  const [isModalOpen, setIsModalOpen] = useState(false);

  // // Sync jobs to localStorage
  // useEffect(() => {
  //   try {
  //     localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  //   } catch (e) {
  //     console.error("Error writing to localStorage", e);
  //   }
  // }, [jobs]);

  // Sync theme to root attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const addJob = async (jobData) => {
    const newJob = {
      ...jobData,
      id: `job-${Date.now()}`,
      appliedDate: jobData.appliedDate || new Date().toISOString().split('T')[0],
      reminders: jobData.reminders || [],
      history: [
        {
          stage: jobData.status || 'applied',
          date: jobData.appliedDate || new Date().toISOString().split('T')[0],
          note: 'Application created.'
        }
      ]
    };

    // 1. Update local React state immediately 
    setJobs(prev => [newJob, ...prev]);

    // 2. Persist to Supabase
    const {error} = await supabase.from('jobs').insert([newJob]);
    
    if(error){
      console.error("Failed to save new job to Supabase: ", error.message);
      return;
    }
  };
  
  

  const updateJob = async (id, updatedFields) => {
    let updatedJobObj = null;

    setJobs(prev =>
      prev.map(job => {
        if (job.id !== id) return job;
        
        let newHistory = job.history || [];
        if (updatedFields.status && updatedFields.status !== job.status) {
          newHistory = [
            ...newHistory,
            {
              stage: updatedFields.status,
              date: new Date().toISOString().split('T')[0],
              note: `Status updated to ${updatedFields.status}`
            }
          ];
          if (updatedFields.status === 'offer' || updatedFields.status === 'accepted') {
            triggerCelebration();
          }
        }

        updatedJobObj = {
          ...job,
          ...updatedFields,
          history: newHistory
        };

        return updatedJobObj;
      }));

      // 2. Persist to Supabase (Single Update)
      if (updatedJobObj){
        const {error} = await supabase.from('jobs').update(updatedJobObj) .eq('id', id);

        if(error){
          console.error("Failed to update job in Supabase: ", error.message);
        }
      }
      
    };

  const updateJobStatus = async (id, newStatus, note = "") => {
  let updatedJobObj = null;

  setJobs(prev =>
    prev.map(job => {
      if (job.id !== id) return job;
      if (job.status === newStatus) return job;

      if (newStatus === 'offer' || newStatus === 'accepted') {
        triggerCelebration();
      }

      const newHistoryItem = {
        stage: newStatus,
        date: new Date().toISOString().split('T')[0],
        note: note || `Moved to ${newStatus.replace('_', ' ')}`
      };

      updatedJobObj = {
        ...job,
        status: newStatus,
        history: [...(job.history || []), newHistoryItem]
      };
      return updatedJobObj;
    })
  );

  if (updatedJobObj) {
    const { error } = await supabase
      .from('jobs')
      .update({
        status: updatedJobObj.status,
        history: updatedJobObj.history
      })
      .eq('id', id);

    if (error) console.error('Error updating status in Supabase:', error);
  }
};

  const deleteJob = async (id) => {
    setJobs(prev => prev.filter(j => j.id !== id));

    const {error} = await supabase.from('jobs').delete().eq('id', id);

    if(error){
      console.error("Failed to delete job from Supabase: ", error.message);
    } 
  };

  const addReminder = async (jobId, reminderData) => {
    const newReminder = {
      ...reminderData,
      id: `rem-${Date.now()}`
    };

    let updatedReminders = [];

    setJobs(prev =>
      prev.map(job => {
        if (job.id !== jobId) return job;
        updatedReminders = [...(job.reminders || []), newReminder];
        return {
          ...job,
          reminders: updatedReminders
        };
      })
    );

    // Persist to Supabase
    const { error } = await supabase
      .from('jobs')
      .update({ reminders: updatedReminders })
      .eq('id', jobId);

    if (error) {
      console.error("Failed to add reminder to Supabase: ", error.message);
    }
  };

  const deleteReminder = async (jobId, reminderId) => {
    let updatedReminders = [];

    setJobs(prev =>
      prev.map(job => {
        if (job.id !== jobId) return job;
        updatedReminders = (job.reminders || []).filter(r => r.id !== reminderId);
        return {
          ...job,
          reminders: updatedReminders
        };
      })
    );

    // Persist to Supabase
    const { error } = await supabase
      .from('jobs')
      .update({ reminders: updatedReminders })
      .eq('id', jobId);

    if (error) {
      console.error("Failed to delete reminder from Supabase: ", error.message);
    }
  };


  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  };

  // Collect all reminders across all jobs
  const allReminders = jobs.flatMap(job => {
    return (job.reminders || []).map(r => ({
      ...r,
      jobId: job.id,
      company: job.company,
      role: job.role,
      status: job.status
    }));
  }).sort((a, b) => new Date(`${a.date}T${a.time || '00:00'}`) - new Date(`${b.date}T${b.time || '00:00'}`));

  // Filtered jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      (job.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.role || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.notes || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All Categories' || job.category === selectedCategory;

    const matchesProgram =
      selectedProgram === 'All Programs' || job.programType === selectedProgram;

    return matchesSearch && matchesCategory && matchesProgram;
  });

  // Backup and Restore
  const exportDataAsJson = () => {
    const dataStr = JSON.stringify(jobs, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `careerpulse_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportDataAsCsv = () => {
    const headers = ['Company', 'Role', 'Category', 'Program Type', 'Status', 'Applied Date', 'Location', 'Salary Range', 'Portal URL', 'Resume Version', 'Notes'];
    const rows = jobs.map(j => [
      `"${(j.company || '').replace(/"/g, '""')}"`,
      `"${(j.role || '').replace(/"/g, '""')}"`,
      `"${(j.category || '').replace(/"/g, '""')}"`,
      `"${(j.programType || '').replace(/"/g, '""')}"`,
      `"${(j.status || '').replace(/"/g, '""')}"`,
      `"${(j.appliedDate || '').replace(/"/g, '""')}"`,
      `"${(j.location || '').replace(/"/g, '""')}"`,
      `"${(j.salaryRange || '').replace(/"/g, '""')}"`,
      `"${(j.portalUrl || '').replace(/"/g, '""')}"`,
      `"${(j.resumeVersion || '').replace(/"/g, '""')}"`,
      `"${(j.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `careerpulse_jobs_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importDataFromJson = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (Array.isArray(parsed)) {
          setJobs(parsed);
          alert(`Successfully imported ${parsed.length} jobs!`);
        } else {
          alert('Invalid JSON file structure.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const resetToDefaultData = () => {
    if (window.confirm("Are you sure you want to reset all jobs to the initial 14 applications? Any unsaved changes will be lost.")) {
      setJobs(INITIAL_JOBS);
    }
  };

  const openCreateModal = () => {
    setEditingJob(null);
    setIsModalOpen(true);
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        filteredJobs,
        allReminders,
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        selectedProgram,
        setSelectedProgram,
        isModalOpen,
        editingJob,
        openCreateModal,
        openEditModal,
        closeModal,
        addJob,
        updateJob,
        updateJobStatus,
        deleteJob,
        addReminder,
        deleteReminder,
        exportDataAsJson,
        exportDataAsCsv,
        importDataFromJson,
        resetToDefaultData
      }}
    >
      {children}
    </JobContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
}
