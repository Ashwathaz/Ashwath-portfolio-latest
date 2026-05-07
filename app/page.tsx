"use client";

import { RecruiterProvider, useRecruiter } from "@/lib/recruiter-context";
import { ContentProvider } from "@/lib/content-context";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Timeline from "@/components/Timeline";
import Footer from "@/components/Footer";
import ChatBar from "@/components/ChatBar";
import RecruiterSplash from "@/components/RecruiterSplash";
import CustomCursor from "@/components/CustomCursor";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import PersonalSections from "@/components/PersonalSections";

function MainContent() {
  const { viewMode } = useRecruiter();
  
  return (
    <>
      <CustomCursor />
      <RecruiterSplash />
      <Header initialDark />
      <main id="main">
        <Hero />
        {viewMode === "personal" ? (
          <div className="personal-after-hero">
            <PersonalSections />
          </div>
        ) : (
          <div className="work-after-hero">
            <Timeline />
            <Projects />
            <Contact />
          </div>
        )}
      </main>
      <Footer />
      {viewMode === "recruiter" && <ChatBar />}
    </>
  );
}

export default function Home() {
  return (
    <ContentProvider>
      <RecruiterProvider>
        <MainContent />
      </RecruiterProvider>
    </ContentProvider>
  );
}
