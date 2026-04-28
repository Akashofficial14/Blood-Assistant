"use client";
import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function About() {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Animation
      gsap.from(".about-hero-text", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.3,
        ease: "power4.out",
      });

      // Reveal Sections on Scroll
      gsap.utils.toArray(".reveal").forEach((section) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
          },
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-white text-black selection:bg-red-600 selection:text-white">
      
      {/* SECTION 1: HERO */}
      <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 border-b border-gray-100">
        <h2 className="about-hero-text text-red-600 uppercase tracking-[0.5em] font-black text-xs mb-6">Our Mission</h2>
        <h1 className="about-hero-text text-5xl md:text-8xl font-black leading-tight tracking-tighter max-w-5xl">
          Bridging the gap between <span className="italic text-gray-400 underline decoration-red-600 underline-offset-8">hope</span> and life.
        </h1>
        <p className="about-hero-text mt-10 text-gray-500 text-lg md:text-xl max-w-2xl leading-relaxed">
          Blood Assistant is Indore's premier real-time network dedicated to 
          connecting blood donors with those in urgent need through precision 
          technology and community action.
        </p>
      </section>

      {/* SECTION 2: THE "WHY" (Split Layout) */}
      <section className="reveal py-32 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="relative group">
          <div className="absolute -inset-4 bg-red-600/5 rounded-[3rem] scale-95 group-hover:scale-100 transition-transform duration-700" />
          <img 
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Healthcare Technology" 
            className="relative rounded-[2.5rem] grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl"
          />
        </div>
        <div className="space-y-8">
          <h3 className="text-4xl font-black leading-tight">Technology meets <br/>Humanity.</h3>
          <p className="text-gray-600 text-lg leading-relaxed">
            In critical moments, every second counts. Traditional blood bank systems often face data lags. 
            We built **Blood Assistant** to provide a live, geo-mapped interface where donors are 
            verified and emergency requests are broadcasted instantly.
          </p>
          <div className="grid grid-cols-2 gap-8 pt-6">
            <div>
              <p className="text-3xl font-black text-red-600">Real-Time</p>
              <p className="text-sm text-gray-400 uppercase tracking-widest mt-2">Availability Tracking</p>
            </div>
            <div>
              <p className="text-3xl font-black text-red-600">Zero Cost</p>
              <p className="text-sm text-gray-400 uppercase tracking-widest mt-2">Community Driven</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: CORE VALUES */}
      <section className="bg-[#0d0d0d] text-white py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="reveal mb-20">
            <h2 className="text-red-600 font-bold uppercase tracking-widest text-sm mb-4">Our Core Values</h2>
            <p className="text-4xl md:text-6xl font-black">How we operate.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <ValueCard 
              title="Transparency" 
              desc="We ensure that donor data is handled with the highest level of privacy and consent." 
            />
            <ValueCard 
              title="Speed" 
              desc="Our algorithms prioritize the nearest available donors to minimize transport time." 
            />
            <ValueCard 
              title="Reliability" 
              desc="Every hospital and donor in our network undergoes a verification process." 
            />
          </div>
        </div>
      </section>

      {/* SECTION 4: CALL TO ACTION */}
      <section className="reveal py-32 text-center px-6">
        <div className="max-w-3xl mx-auto space-y-10">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter">Ready to make an impact?</h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="px-12 py-5 bg-red-600 text-white rounded-2xl font-black text-lg hover:bg-black transition-all">
              Become a Donor
            </button>
            <button className="px-12 py-5 border-2 border-black text-black rounded-2xl font-black text-lg hover:bg-black hover:text-white transition-all">
              Find Blood
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0d0d0d] text-white pt-24 pb-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <h3 className="text-2xl font-black tracking-tighter">Blood <span className="text-red-600">Assistant.</span></h3>
            <p className="text-gray-500 max-w-sm leading-relaxed">
              Indore's digital life-saving network. We leverage modern web tech 
              to ensure no request for blood goes unanswered.
            </p>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-red-600">Quick Links</h4>
            <ul className="space-y-4 text-gray-400 font-medium text-sm">
              <li className="hover:text-white cursor-pointer transition-colors">Home</li>
              <li className="hover:text-white cursor-pointer transition-colors">Donate Blood</li>
              <li className="hover:text-white cursor-pointer transition-colors">Search Banks</li>
              <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-red-600">Connect</h4>
            <ul className="space-y-4 text-gray-400 font-medium text-sm">
              <li className="hover:text-white cursor-pointer transition-colors">Instagram</li>
              <li className="hover:text-white cursor-pointer transition-colors">Twitter</li>
              <li className="hover:text-white cursor-pointer transition-colors">LinkedIn</li>
              <li className="hover:text-white cursor-pointer transition-colors">Contact Support</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-600 text-xs font-bold uppercase tracking-widest">
            © 2026 Akash Warade. Developed for Impact.
          </p>
          <div className="flex gap-8 text-gray-600 text-xs font-bold uppercase tracking-widest">
            <span className="hover:text-red-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-red-600 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* Helper Component */
function ValueCard({ title, desc }) {
  return (
    <div className="reveal group p-10 border border-white/10 rounded-[2rem] hover:bg-white hover:text-black transition-all duration-500">
      <div className="w-12 h-1 bg-red-600 mb-8 group-hover:w-full transition-all duration-500" />
      <h4 className="text-2xl font-bold mb-4">{title}</h4>
      <p className="text-gray-500 group-hover:text-gray-700 leading-relaxed">
        {desc}
      </p>
    </div>
  );
}