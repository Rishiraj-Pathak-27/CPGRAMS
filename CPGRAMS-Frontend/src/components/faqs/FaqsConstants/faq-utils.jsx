import { useState } from "react";
import { ChevronDown, ChevronUp, Search, ChevronLeft } from "lucide-react";
import Header from "../../header/MainHeader";
import Footer from "../../footer/Footer";

const faqData = [
  {
    id: "general",
    title: "General Questions",
    questions: [
      {
        question: "What is an Online Grievance Redressal System?",
        answer:
          "This system allows users to 'submit' complaints or grievances online and get them resolved in a transparent and efficient manner.",
      },
      {
        question: "Who can use this system?",
        answer:
          "Any registered user such as citizens, employees, or students (based on your system context) can use it.",
      },
      {
        question: "Is registration required to file a grievance?",
        answer:
          "Yes, you need to 'sign up' or 'log in' to file and track grievances.",
      },
    ],
  },
  {
    id: "filing",
    title: "Filing a Grievance",
    questions: [
      {
        question: "How do I file a grievance?",
        answer:
          'Go to the dashboard after "login", click on "Add Grievance," fill in the form with necessary details and submit it.',
      },
      {
        question: "What kind of grievances can I report?",
        answer:
          "You can report issues related to services, harassment, delays, misbehavior, etc., depending on your organization's domain.",
      },
      {
        question: "Can I attach documents or evidence with my complaint?",
        answer:
          "Yes, there is an option to upload supporting files like images or PDFs.",
      },
    ],
  },
  {
    id: "tracking",
    title: "Tracking and Updates",
    questions: [
      {
        question: "How can I check the status of my complaint?",
        answer:
          'After logging in, go to "My Grievances" to view the status, remarks, and updates.',
      },
      {
        question: "Will I get notified when my grievance is resolved?",
        answer:
          "Yes, you will be notified via email/SMS once your grievance is addressed.",
      },
    ],
  },
  {
    id: "resolution",
    title: "Grievance Resolution",
    questions: [
      {
        question: "How long does it take to resolve a grievance?",
        answer:
          "Resolution time depends on the complexity of the issue, but most grievances are resolved within X days.",
      },
      {
        question: "What if I am not satisfied with the resolution?",
        answer:
          "You can reopen the grievance or escalate it to a higher authority within the system.",
      },
    ],
  },
  {
    id: "support",
    title: "Technical Support",
    questions: [
      {
        question: "I forgot my password. What should I do?",
        answer:
          'Click on "Forgot Password" on the login page and follow the steps to reset it.',
      },
      {
        question:
          "The system is not loading or showing errors. Whom do I contact?",
        answer:
          "Contact our technical support team at support@example.com or call our helpline number.",
      },
    ],
  },
  {
    id: "privacy",
    title: "Privacy and Security",
    questions: [
      {
        question: "Is my personal information secure on this platform?",
        answer:
          "Yes, the platform uses encryption and secure login methods to protect your data.",
      },
      {
        question: "Will my grievance be visible to the public?",
        answer:
          "No, all grievances are confidential and visible only to authorized personnel.",
      },
    ],
  },
];

export {
  useState,
  ChevronDown,
  ChevronUp,
  Search,
  ChevronLeft,
  faqData,
  Header,
  Footer,
};
