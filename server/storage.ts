import { 
  users, type User, type InsertUser,
  waitlistEntries, type WaitlistEntry, type InsertWaitlistEntry,
  contactMessages, type ContactMessage, type InsertContactMessage,
  projects, type Project, type InsertProject 
} from "@shared/schema";

// Define the storage interface with all required CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Waitlist operations
  addToWaitlist(entry: InsertWaitlistEntry): Promise<WaitlistEntry>;
  getWaitlistEntries(): Promise<WaitlistEntry[]>;
  
  // Contact form operations
  saveContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  markContactMessageAsRead(id: number): Promise<ContactMessage | undefined>;
  
  // Portfolio project operations
  createProject(project: InsertProject): Promise<Project>;
  getProjects(): Promise<Project[]>;
  getProjectsByCategory(category: string): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private waitlist: Map<number, WaitlistEntry>;
  private contactMessages: Map<number, ContactMessage>;
  private projects: Map<number, Project>;
  
  private userId: number;
  private waitlistId: number;
  private messageId: number;
  private projectId: number;

  constructor() {
    this.users = new Map();
    this.waitlist = new Map();
    this.contactMessages = new Map();
    this.projects = new Map();
    
    this.userId = 1;
    this.waitlistId = 1;
    this.messageId = 1;
    this.projectId = 1;
    
    // Add some sample projects with correct typing
    const sampleProjects: Omit<Project, 'id' | 'createdAt'>[] = [
      {
        title: "Neon Dreams Collection",
        description: "Futuristic digital art collection exploring neon aesthetics",
        category: "art",
        imageUrl: "https://images.unsplash.com/photo-1618004912476-29818d81ae2e?auto=format&q=80",
        featured: true,
        details: {
          tools: ["Photoshop", "Illustrator"],
          client: "Personal Project",
        }
      },
      {
        title: "Quantum Dashboard",
        description: "Advanced analytics platform with real-time data visualization",
        category: "software",
        imageUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&q=80",
        featured: true,
        details: {
          tools: ["React", "D3.js", "Node.js"],
          link: "https://example.com/dashboard",
        }
      },
      {
        title: "Abstract Mindscapes",
        description: "Exploring the boundaries between consciousness and digital expression",
        category: "art",
        imageUrl: "https://images.unsplash.com/photo-1633259584604-afdc243122ea?auto=format&q=80",
        featured: false,
        details: {
          tools: ["Blender", "AfterEffects"],
        }
      },
      {
        title: "Nexus Chat Platform",
        description: "End-to-end encrypted messaging with advanced collaboration features",
        category: "software",
        imageUrl: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&q=80",
        featured: false,
        details: {
          tools: ["React", "Node.js", "WebRTC"],
          link: "https://example.com/nexus",
        }
      },
      {
        title: "Cyber Flora Series",
        description: "Merging natural elements with technological aesthetics",
        category: "art",
        imageUrl: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&q=80",
        featured: false,
        details: {
          tools: ["Photoshop", "Procreate"],
        }
      },
      {
        title: "Fusion Workspace",
        description: "Collaborative workspace integrating AI-powered productivity tools",
        category: "software",
        imageUrl: "https://images.unsplash.com/photo-1551650992-ee4fd47df41f?auto=format&q=80",
        featured: false,
        details: {
          tools: ["React", "TensorFlow.js", "Node.js"],
          link: "https://example.com/fusion",
        }
      }
    ];
    
    sampleProjects.forEach(project => {
      const now = new Date();
      const id = this.projectId++;
      this.projects.set(id, { 
        ...project, 
        id, 
        createdAt: now
      });
    });
    
    // Add admin user
    this.createUser({
      username: "admin",
      password: "adminpassword",
      isAdmin: true
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    // Make sure isAdmin is always defined as required by the schema
    const user: User = { 
      ...insertUser, 
      id,
      isAdmin: insertUser.isAdmin ?? false 
    };
    this.users.set(id, user);
    return user;
  }
  
  // Waitlist operations
  async addToWaitlist(entry: InsertWaitlistEntry): Promise<WaitlistEntry> {
    const id = this.waitlistId++;
    const now = new Date();
    const waitlistEntry: WaitlistEntry = { 
      ...entry, 
      id, 
      createdAt: now,
      receivesUpdates: entry.receivesUpdates ?? true 
    };
    this.waitlist.set(id, waitlistEntry);
    return waitlistEntry;
  }
  
  async getWaitlistEntries(): Promise<WaitlistEntry[]> {
    return Array.from(this.waitlist.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  // Contact form operations
  async saveContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const id = this.messageId++;
    const now = new Date();
    const contactMessage: ContactMessage = { 
      ...message, 
      id, 
      createdAt: now,
      isRead: false 
    };
    this.contactMessages.set(id, contactMessage);
    return contactMessage;
  }
  
  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async markContactMessageAsRead(id: number): Promise<ContactMessage | undefined> {
    const message = this.contactMessages.get(id);
    if (!message) return undefined;
    
    const updatedMessage = { ...message, isRead: true };
    this.contactMessages.set(id, updatedMessage);
    return updatedMessage;
  }
  
  // Portfolio project operations
  async createProject(project: InsertProject): Promise<Project> {
    const id = this.projectId++;
    const now = new Date();
    
    // Extract and properly type the details object
    const details = project.details ? {
      tools: Array.isArray(project.details.tools) ? project.details.tools : undefined,
      client: typeof project.details.client === 'string' ? project.details.client : undefined,
      link: typeof project.details.link === 'string' ? project.details.link : undefined,
      gallery: Array.isArray(project.details.gallery) ? project.details.gallery : undefined
    } : null;
    
    const newProject: Project = { 
      ...project, 
      id, 
      createdAt: now,
      featured: project.featured ?? false,
      details
    };
    this.projects.set(id, newProject);
    return newProject;
  }
  
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async getProjectsByCategory(category: string): Promise<Project[]> {
    return Array.from(this.projects.values())
      .filter(project => project.category === category)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }
  
  async updateProject(id: number, updateData: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    // Process and properly type the details if provided
    let details = project.details;
    if (updateData.details) {
      details = {
        tools: Array.isArray(updateData.details.tools) ? updateData.details.tools : project.details?.tools,
        client: typeof updateData.details.client === 'string' ? updateData.details.client : project.details?.client,
        link: typeof updateData.details.link === 'string' ? updateData.details.link : project.details?.link,
        gallery: Array.isArray(updateData.details.gallery) ? updateData.details.gallery : project.details?.gallery
      };
    }
    
    // Ensure we have proper typing for our updatedProject
    const updatedProject: Project = { 
      ...project, 
      ...updateData,
      featured: updateData.featured ?? project.featured,
      details
    };
    
    this.projects.set(id, updatedProject);
    return updatedProject;
  }
  
  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }
}

export const storage = new MemStorage();
