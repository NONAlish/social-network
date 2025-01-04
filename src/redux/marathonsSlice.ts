import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Detail {
  topic: string;
  subtopics: string[];
}

interface Stage {
  name: string;
  details: Detail[] | string[];  // Details can now be either an array of Detail objects or an array of strings
}

interface Marathon {
  title: string;
  stages: Stage[];
}

interface MarathonsState {
  marathons: Marathon[];
  selectedMarathon: string | null;
}

const initialState: MarathonsState = {
  marathons: [
    {
      title: "Frontend",
      stages: [
        {
          name: "HTML/CSS",
          details: [
            {
              topic: "HTML5 Semantics",
              subtopics: [
                "Using `<section>`, `<article>`, `<header>`, `<footer>`",
                "The importance of semantic elements for SEO",
                "Accessible HTML elements for screen readers"
              ]
            },
            {
              topic: "CSS Flexbox and Grid",
              subtopics: [
                "Understanding Flexbox container properties",
                "Flex item properties (grow, shrink, basis)",
                "Grid layout syntax and usage",
                "Creating responsive layouts with Flexbox and Grid"
              ]
            },
            {
              topic: "Responsive Design",
              subtopics: [
                "Media queries and breakpoints",
                "Mobile-first design",
                "Responsive typography and images",
                "Viewports and scaling in different devices"
              ]
            },
            {
              topic: "CSS Preprocessors (Sass, LESS)",
              subtopics: [
                "Variables, nesting, and mixins in Sass",
                "Using functions and inheritance in LESS",
                "Configuring Sass/LESS in a project",
                "Advantages of using preprocessors in large projects"
              ]
            }
          ]
        },
        {
          name: "JavaScript",
          details: [
            {
              topic: "ES6+ Features",
              subtopics: [
                "Arrow functions",
                "Destructuring assignment",
                "Template literals",
                "Modules and imports/exports"
              ]
            },
            {
              topic: "DOM Manipulation",
              subtopics: [
                "Accessing and modifying DOM elements",
                "Event listeners and handling events",
                "DOM traversal and manipulation",
                "Creating and removing elements dynamically"
              ]
            },
            {
              topic: "Event Handling",
              subtopics: [
                "Event delegation",
                "Preventing default actions",
                "Event bubbling and capturing",
                "Handling form events"
              ]
            },
            {
              topic: "Asynchronous JavaScript (Promises, Async/Await)",
              subtopics: [
                "Creating and chaining promises",
                "Handling errors in promises",
                "Understanding the event loop",
                "Async/Await syntax for handling asynchronous code"
              ]
            }
          ]
        },
        {
          name: "React",
          details: [
            {
              topic: "JSX",
              subtopics: [
                "What is JSX and why it’s used in React",
                "Writing components with JSX",
                "JSX expressions and embedding variables",
                "JSX and HTML differences"
              ]
            },
            {
              topic: "State and Props",
              subtopics: [
                "Using `useState` hook for state management",
                "Passing data between components using props",
                "State and props immutability",
                "Managing forms with state"
              ]
            },
            {
              topic: "Components (Class and Functional)",
              subtopics: [
                "Class components and lifecycle methods",
                "Functional components and hooks",
                "When to use class vs. functional components",
                "Understanding component re-rendering"
              ]
            },
            {
              topic: "React Hooks (useState, useEffect, useRef)",
              subtopics: [
                "Using `useState` for local component state",
                "Effect hook for side effects and fetching data",
                "Using `useRef` for accessing DOM elements",
                "Custom hooks for reusable logic"
              ]
            }
          ]
        }
      ]
    },
    {
      title: "Backend",
      stages: [
        {
          name: "Node.js",
          details: [
            {
              topic: "Node.js Fundamentals",
              subtopics: [
                "What is Node.js and why use it?",
                "The event-driven architecture",
                "Core modules (fs, path, http, etc.)",
                "Global objects (process, __dirname)"
              ]
            },
            {
              topic: "NPM (Node Package Manager)",
              subtopics: [
                "Installing and managing packages",
                "Using `package.json` for dependencies",
                "Running scripts with npm",
                "Creating custom scripts"
              ]
            },
            {
              topic: "Event Loop",
              subtopics: [
                "Understanding non-blocking I/O",
                "Call stack and event queue",
                "Timers and asynchronous callbacks",
                "How Node.js handles concurrency"
              ]
            },
            {
              topic: "Asynchronous Programming",
              subtopics: [
                "Callback functions",
                "Promises and chaining",
                "Async/Await for cleaner code",
                "Handling errors in async code"
              ]
            }
          ]
        },
        {
          name: "Express",
          details: [
            {
              topic: "Building RESTful APIs",
              subtopics: [
                "Setting up Express server",
                "Creating RESTful routes",
                "Handling request and response objects",
                "Best practices for building APIs"
              ]
            },
            {
              topic: "Middleware in Express",
              subtopics: [
                "What are middleware functions?",
                "Creating custom middleware",
                "Built-in middleware in Express",
                "Error-handling middleware"
              ]
            },
            {
              topic: "Routing",
              subtopics: [
                "Setting up routes with Express",
                "Route parameters and query strings",
                "Middleware for route-specific behavior",
                "Express Router for modular route management"
              ]
            },
            {
              topic: "Error Handling",
              subtopics: [
                "Error handling in Express",
                "Using `next()` for error forwarding",
                "Custom error handling middleware",
                "Handling 404 errors"
              ]
            }
          ]
        },
        {
          name: "Databases",
          details: [
            {
              topic: "SQL vs NoSQL Databases",
              subtopics: [
                "Understanding relational and non-relational databases",
                "Advantages and disadvantages of SQL and NoSQL",
                "When to use SQL vs NoSQL",
                "Common SQL and NoSQL database types"
              ]
            },
            {
              topic: "MySQL or PostgreSQL",
              subtopics: [
                "Setting up MySQL or PostgreSQL databases",
                "Basic SQL queries (SELECT, INSERT, UPDATE, DELETE)",
                "Joins, subqueries, and aggregations",
                "Database normalization"
              ]
            },
            {
              topic: "MongoDB Basics",
              subtopics: [
                "Setting up MongoDB",
                "CRUD operations in MongoDB",
                "MongoDB data modeling and collections",
                "Indexing and performance optimization"
              ]
            },
            {
              topic: "Database Relationships",
              subtopics: [
                "One-to-many and many-to-many relationships",
                "Foreign keys and relational integrity",
                "Database schemas and normalization",
                "Document-based relationships in NoSQL"
              ]
            }
          ]
        }
      ]
    },
    {
      title: "Fullstack",
      stages: [
        {
          name: "Frontend",
          details: [
            "HTML/CSS Basics",
            "JavaScript",
            "Responsive Web Design"
          ]
        },
        {
          name: "Backend",
          details: [
            "Node.js",
            "Express",
            "API Development"
          ]
        },
        {
          name: "Deployment",
          details: [
            "CI/CD (Continuous Integration/Continuous Deployment)",
            "Docker",
            "Cloud Platforms (AWS, Heroku)"
          ]
        }
      ]
    },
    {
      title: "Mobile Development",
      stages: [
        {
          name: "React Native",
          details: [
            "JSX and Components in React Native",
            "Navigation (React Navigation)",
            "State Management in React Native"
          ]
        },
        {
          name: "Flutter",
          details: [
            "Dart Language Basics",
            "Widgets and Layouts",
            "State Management"
          ]
        },
        {
          name: "Android/iOS",
          details: [
            "Android Studio Setup",
            "Xcode Setup for iOS",
            "Building Native Features"
          ]
        }
      ]
    },
    {
      title: "DevOps",
      stages: [
        {
          name: "CI/CD",
          details: [
            "Setting up Jenkins or GitHub Actions",
            "Automated Testing and Deployment",
            "Version Control Integration"
          ]
        },
        {
          name: "Docker",
          details: [
            "Docker Basics",
            "Creating and Managing Docker Containers",
            "Docker Compose"
          ]
        },
        {
          name: "Kubernetes",
          details: [
            "Kubernetes Architecture",
            "Deploying Containers with Kubernetes",
            "Scaling Applications"
          ]
        }
      ]
    },
    {
      title: "Algorithms",
      stages: [
        {
          name: "Sorting",
          details: [
            "Bubble Sort",
            "Quick Sort",
            "Merge Sort",
            "Time Complexity Analysis"
          ]
        },
        {
          name: "Search algorithms",
          details: [
            "Binary Search",
            "Breadth-First Search (BFS)",
            "Depth-First Search (DFS)"
          ]
        },
        {
          name: "Graph algorithms",
          details: [
            "Dijkstra's Algorithm",
            "A* Search",
            "Graph Traversal"
          ]
        }
      ]
    }
  ],
  selectedMarathon: null
};

const marathonsSlice = createSlice({
  name: 'marathons',
  initialState,
  reducers: {
    setSelectedMarathon(state, action: PayloadAction<string | null>) {
      state.selectedMarathon = action.payload;
    }
  }
});

export const { setSelectedMarathon } = marathonsSlice.actions;
export default marathonsSlice.reducer;
