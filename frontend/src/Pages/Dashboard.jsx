import React, { useState } from 'react';
import './Dashboard.css';

// --- SVG Icons (replacing react-icons) ---
// No need to install anything for these to work.
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const CodeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>;
const ChartBarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>;
const BrainIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.97-2.97A2.5 2.5 0 0 1 5 13.5V11a2.5 2.5 0 0 1 2.5-2.5h1A2.5 2.5 0 0 1 11 6V4.5a2.5 2.5 0 0 1 2.5-2.5h.5A2.5 2.5 0 0 1 17 4.5v1.5a2.5 2.5 0 0 1 2.5 2.5h1a2.5 2.5 0 0 1 2.5 2.5v2.5a2.5 2.5 0 0 1-1.53 2.3A2.5 2.5 0 0 1 19 19.5v.04A2.5 2.5 0 0 1 14.5 22h-5A2.5 2.5 0 0 1 7 19.5v-2A2.5 2.5 0 0 1 4.5 15V13A2.5 2.5 0 0 1 7 10.5h1A2.5 2.5 0 0 1 10.5 8V6A2.5 2.5 0 0 1 8 3.5a2.5 2.5 0 0 1-1.46-.56"></path></svg>;
const ServerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>;
const ProjectDiagramIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="5" cy="6" r="3"></circle><circle cx="19" cy="6" r="3"></circle><path d="M5 9v4a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3V9"></path><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="16" x2="12" y2="20"></line></svg>;
const GraduationCapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c0 1.7.8 3.2 2.1 4.2C9.4 22.2 10.7 23 12 23s2.6-.8 3.9-1.8c1.3-1 2.1-2.5 2.1-4.2v-5"></path></svg>;
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>;

const domainIcons = {
  frontend: <CodeIcon />,
  backend: <ServerIcon />,
  'data analyst': <ChartBarIcon />,
  ML: <BrainIcon />,
};

const InfoSection = ({ icon, title, items, onAddItem, onRemoveItem, onEditItem, inputFields, currentItem, setCurrentItem }) => {
  const isEditing = currentItem && currentItem.id;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddItem();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="profile-section glassy-card">
      <h3>{icon} {title}</h3>
      <div className="item-list">
        {items.map((item) => (
          <div key={item.id} className="list-item">
            <div className="item-details">
              {Object.entries(item).map(([key, value]) => {
                if (key !== 'id') {
                  return <span key={key}><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}</span>;
                }
                return null;
              })}
            </div>
            <div className="item-actions">
              <button onClick={() => onEditItem(item)} className="icon-btn edit-btn" aria-label="Edit"><EditIcon /></button>
              <button onClick={() => onRemoveItem(item.id)} className="icon-btn remove-btn" aria-label="Remove"><TrashIcon /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="placeholder-text">No {title.toLowerCase()} added yet.</p>}
      </div>
      <form onSubmit={handleSubmit} className="add-item-form">
        <div className="input-grid">
          {inputFields.map(field => (
            <input
              key={field.name}
              type={field.type || 'text'}
              name={field.name}
              placeholder={field.placeholder}
              value={currentItem ? currentItem[field.name] || '' : ''}
              onChange={handleInputChange}
              required
            />
          ))}
        </div>
        <button type="submit" className="add-btn">
          <PlusIcon /> {isEditing ? `Update` : `Add`}
        </button>
      </form>
    </div>
  );
};

const Dashboard = () => {
  const [theme, setTheme] = useState('dark');
  const domains = ['frontend', 'backend', 'data analyst', 'ML'];
  const candidateName = 'Prahlad';
  const username = 'prahlad_in';

  const [selectedDomains, setSelectedDomains] = useState([]);
  const [cv, setCv] = useState(null);
  const [skills, setSkills] = useState([]);
  const [currentSkill, setCurrentSkill] = useState({ name: '' });
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState({ title: '', description: '' });
  const [education, setEducation] = useState([]);
  const [currentEducation, setCurrentEducation] = useState({ degree: '', institution: '', year: '' });
  const [experience, setExperience] = useState([]);
  const [currentExperience, setCurrentExperience] = useState({ role: '', company: '', duration: '' });


  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const handleDomainToggle = (domain) => {
    setSelectedDomains((prev) =>
      prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]
    );
  };

  const handleCvChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setCv(event.target.files[0]);
    }
  };
  
  const createItemHandlers = (items, setItems, currentItem, setCurrentItem, resetItem) => ({
    handleAddItem: () => {
      const isItemValid = Object.keys(resetItem).every(key => currentItem[key] && currentItem[key].trim() !== '');
      if (!isItemValid) {
        alert("Please fill out all fields.");
        return;
      }
      if (currentItem.id) {
        setItems(items.map(item => item.id === currentItem.id ? currentItem : item));
      } else {
        setItems([...items, { ...currentItem, id: Date.now() }]);
      }
      setCurrentItem(resetItem);
    },
    handleRemoveItem: (id) => {
      setItems(items.filter(item => item.id !== id));
    },
    handleEditItem: (itemToEdit) => {
      setCurrentItem(itemToEdit);
    }
  });

  const skillHandlers = createItemHandlers(skills, setSkills, currentSkill, setCurrentSkill, { name: '' });
  const projectHandlers = createItemHandlers(projects, setProjects, currentProject, setCurrentProject, { title: '', description: '' });
  const educationHandlers = createItemHandlers(education, setEducation, currentEducation, setCurrentEducation, { degree: '', institution: '', year: '' });
  const experienceHandlers = createItemHandlers(experience, setExperience, currentExperience, setCurrentExperience, { role: '', company: '', duration: '' });

  const handleFinalSubmit = () => {
    if (selectedDomains.length === 0 || !cv) {
      alert("Please select at least one domain and upload your CV.");
      return;
    }
    const finalData = { candidateName, username, selectedDomains, cv: cv.name, skills, projects, education, experience };
    console.log('--- Form Submitted ---', finalData);
    alert('Application data logged to the console!');
  };

  return (
    <div className={`dashboard-container ${theme}`}>
      <div className="aurora-background"></div>

      <header className="dashboard-header glassy-card">
        <div className="header-left">
          <div className="user-profile">
            <div className="user-avatar"><UserIcon /></div>
            <div className="user-info">
              <span className="candidate-name">{candidateName}</span>
              <span className="username">@{username}</span>
            </div>
          </div>
        </div>
        <div className="header-center">
          <div className="logo">
            <h2>MyDashboard</h2>
          </div>
        </div>
        <div className="header-right">
            <label className="theme-switch">
                <input type="checkbox" onChange={toggleTheme} checked={theme === 'light'} />
                <span className="slider">
                    <SunIcon className="sun-icon" />
                    <MoonIcon className="moon-icon" />
                </span>
            </label>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="domains-section">
          <h1>Available Domains</h1>
          <p>Select your domains of interest. They will be added to your profile.</p>
          <div className="domains-grid">
            {domains.map((domain) => (
              <div
                key={domain}
                className={`domain-card glassy-card ${selectedDomains.includes(domain) ? 'selected' : ''}`}
                onClick={() => handleDomainToggle(domain)}
              >
                <div className="domain-icon">{domainIcons[domain]}</div>
                <h3>{domain}</h3>
                <div className="selection-indicator"><CheckCircleIcon/></div>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-details">
          <h2>Complete Your Profile</h2>

          <div className="profile-section glassy-card">
            <h3><UploadIcon/> Upload CV</h3>
             <label className="custom-file-upload">
                <input type="file" onChange={handleCvChange} accept=".pdf,.doc,.docx" />
                Choose File
            </label>
            {cv && <p className="file-name">Selected: {cv.name}</p>}
          </div>

          <InfoSection
            icon={<CodeIcon/>}
            title="Skills"
            items={skills}
            {...skillHandlers}
            inputFields={[{ name: 'name', placeholder: 'e.g., React.js' }]}
            currentItem={currentSkill}
            setCurrentItem={setCurrentSkill}
          />
          
          <InfoSection
            icon={<ProjectDiagramIcon/>}
            title="Projects"
            items={projects}
            {...projectHandlers}
            inputFields={[
              { name: 'title', placeholder: 'Project Title' },
              { name: 'description', placeholder: 'A brief description' }
            ]}
            currentItem={currentProject}
            setCurrentItem={setCurrentProject}
          />

          <InfoSection
            icon={<GraduationCapIcon/>}
            title="Education"
            items={education}
            {...educationHandlers}
            inputFields={[
              { name: 'degree', placeholder: 'Degree' },
              { name: 'institution', placeholder: 'Institution Name' },
              { name: 'year', placeholder: 'Year of Completion' }
            ]}
            currentItem={currentEducation}
            setCurrentItem={setCurrentEducation}
          />

          <InfoSection
            icon={<BriefcaseIcon/>}
            title="Experience"
            items={experience}
            {...experienceHandlers}
            inputFields={[
              { name: 'role', placeholder: 'Job Role' },
              { name: 'company', placeholder: 'Company Name' },
              { name: 'duration', placeholder: 'e.g., 2021 - 2023' }
            ]}
            currentItem={currentExperience}
            setCurrentItem={setCurrentExperience}
          />

          <button className="submit-all-button" onClick={handleFinalSubmit}>
            Submit Application
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;