import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { supabase } from '../libs/supabase';
import {useAuth} from './AuthContext';

const JobContext = createContext();

const THEME_KEY = 'careerpulse_theme';

export function JobProvider({ children }) {
  const {user} = useAuth(); // get current user
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    async function fetchJobs(){
      // if no user is logged in, empty the list
      if (!user){
        setJobs([]);
        return;
      }
      try{
        setLoading(true);
        const{data, error} = await supabase.from('jobs')
        .select(`
          *,
          history:job_history(*),
          reminders:job_reminders(*)
          `)
        .eq('user_id',user.id) // Filter only this user's jobs!
        .order('created_at',{ascending: false});
        if(error) throw error;
        if(data) setJobs(data);

        

      }catch(err){
        console.error("Failed to fetch jobs: ",err.message);

      }finally{
        setLoading(false);
      }

    }
    fetchJobs();
  },[user]);
  


  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_KEY) || 'dark';
  });

  const [activeTab, setActiveTab] = useState('kanban'); // 'kanban' | 'table' | 'sankey' | 'reminders'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedProgram, setSelectedProgram] = useState('All Programs');
  const [editingJob, setEditingJob] = useState(null); // null = modal closed, {} = new job, { ... } = edit
  const [isModalOpen, setIsModalOpen] = useState(false);

 
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const addJob = async (jobData) => {

    const jobId = `job-${Date.now()}`;
    const appliedDate = jobData.appliedDate || new Date().toISOString().split('T')[0];
    const initialHistory = {
      stage: jobData.status || 'applied',
      date: appliedDate,
      note: "Application created."
    };


      const newJob = {
        id: jobId,
        user_id: user?.id, // IMPORTANT: set the owner
        company: jobData.company,
        role: jobData.role,
        category: jobData.category,
        programType: jobData.programType,
        location: jobData.location,
        status: jobData.status || 'applied',
        appliedDate: appliedDate,
        portalUrl: jobData.portalUrl,
        salaryRange: jobData.salaryRange,
        notes: jobData.notes,
        resumeVersion: jobData.resumeVersion,
        reminders: [],
        history: [initialHistory]
      };

    // 1. Update local React state immediately 
    setJobs(prev => [newJob, ...prev]);

    // Insert into 'jobs' table (without child arrays)
    const { history, reminders, ...jobRecord } = newJob;
    const { error: jobError } = await supabase.from('jobs').insert([jobRecord]);
    if (jobError) console.error("Failed to insert job:", jobError.message);
    // Insert into 'job_history' child table
    const { error: histError } = await supabase.from('job_history').insert([{
      job_id: jobId,
      stage: initialHistory.stage,
      date: initialHistory.date,
      note: initialHistory.note
    }]);
    if (histError) console.error("Failed to insert initial history:", histError.message);
  
  };
  
  
  // --- 3. UPDATE JOB & STATUS ---
  const updateJob = async (id, updatedFields) => {
    let updatedJobObj = null;
    let newHistoryItem = null;
    setJobs(prev =>
      prev.map(job => {
        if (job.id !== id) return job;
        let newHistory = job.history || [];
        if (updatedFields.status && updatedFields.status !== job.status) {
          newHistoryItem = {
            stage: updatedFields.status,
            date: new Date().toISOString().split('T')[0],
            note: `Status updated to ${updatedFields.status.replace('_', ' ')}`
          };
          newHistory = [...newHistory, newHistoryItem];
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
      })
    );
    if (updatedJobObj) {
      // 1. Update jobs table (strip child arrays)
      const { history, reminders, ...jobRecord } = updatedJobObj;
      const { error: jobError } = await supabase.from('jobs').update(jobRecord).eq('id', id);
      if (jobError) console.error("Failed to update job:", jobError.message);
      // 2. If status changed, insert new row into job_history
      if (newHistoryItem) {
        const { error: histError } = await supabase.from('job_history').insert([{
          job_id: id,
          stage: newHistoryItem.stage,
          date: newHistoryItem.date,
          note: newHistoryItem.note
        }]);
        if (histError) console.error("Failed to insert history item:", histError.message);
      }
    }
  };
  const updateJobStatus = async (id, newStatus, note = "") => {
    await updateJob(id, { status: newStatus });
  };
  // --- 4. DELETE JOB ---
  const deleteJob = async (id) => {
    setJobs(prev => prev.filter(j => j.id !== id));
    // Deleting the job automatically deletes all its history & reminders (ON DELETE CASCADE)
    const { error } = await supabase.from('jobs').delete().eq('id', id);
    if (error) console.error("Failed to delete job:", error.message);
  };
  // --- 5. ADD & DELETE REMINDERS ---
  const addReminder = async (jobId, reminderData) => {
    const newReminder = {
      id: `rem-${Date.now()}`,
      job_id: jobId,
      title: reminderData.title,
      date: reminderData.date,
      time: reminderData.time || null,
      durationMinutes: reminderData.durationMinutes || 30,
      type: reminderData.type || 'General',
      locationOrLink: reminderData.locationOrLink || '',
      notes: reminderData.notes || ''
    };
    // Immediate UI update
    setJobs(prev =>
      prev.map(job => {
        if (job.id !== jobId) return job;
        return {
          ...job,
          reminders: [...(job.reminders || []), newReminder]
        };
      })
    );
    // Insert into 'job_reminders' table
    const { error } = await supabase.from('job_reminders').insert([newReminder]);
    if (error) console.error("Failed to add reminder:", error.message);
  };
  const deleteReminder = async (jobId, reminderId) => {
    // Immediate UI update
    setJobs(prev =>
      prev.map(job => {
        if (job.id !== jobId) return job;
        return {
          ...job,
          reminders: (job.reminders || []).filter(r => r.id !== reminderId)
        };
      })
    );
    // Delete from 'job_reminders' table
    const { error } = await supabase.from('job_reminders').delete().eq('id', reminderId);
    if (error) console.error("Failed to delete reminder:", error.message);
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
      //setJobs(INITIAL_JOBS);
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
