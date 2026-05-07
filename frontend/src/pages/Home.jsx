"use client";
import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate, NavLink } from "react-router-dom";

export default function Home() {
  const containerRef = useRef(null);
  const infoRef = useRef(null);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Hero Entrance - Slightly faster for better perceived performance
      gsap.from(".animate-text", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      });

      gsap.to(".animate-appear", {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6,
        delay: 0.4,
        stagger: 0.1,
        ease: "back.out(1.2)",
      });

      // 2. Background Pulse
      gsap.to(".bg-pulse", {
        scale: 1.2,
        opacity: 0.4,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // 3. FIXED ScrollTrigger Card Logic
      // Added immediateRender: false to prevent the "hidden on load" bug
      gsap.from(".info-card", {
        scrollTrigger: {
          trigger: infoRef.current,
          start: "top 85%", // Trigger earlier so the user doesn't see a blank space
          toggleActions: "play none none reverse",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        immediateRender: false, // CRITICAL: Prevents elements staying hidden on first load
        clearProps: "all", // Cleans up styles after animation
      });
    }, containerRef);

    // Force refresh to catch the correct scroll positions after the DOM settles
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timer);
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-[#0d0d0d] h-full w-full selection:bg-red-600 selection:text-white"
    >
      {/* SECTION 1: HERO */}
      <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
        <div className="bg-pulse absolute w-[400px] h-[400px] bg-red-600/20 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="max-w-6xl w-full text-center relative z-10 px-6">
          <div className="animate-text inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-red-600 animate-ping"></span>
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-red-500">
              Real-Time Network Active
            </span>
          </div>

          <h1 className="animate-text text-6xl md:text-8xl font-black leading-[1.1] mb-8 tracking-tight">
            Locate nearby <br />
            <span className="text-red-600 italic">blood banks</span>
          </h1>

          <p className="animate-text text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            With real-time availability and{" "}
            <span className="text-white">precise distance information</span>.
            Join the mission to bridge the gap between donors and those in need.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button
              onClick={() => navigate("/bloodBanks")}
              className="animate-appear opacity-0 scale-90 group relative inline-flex items-center justify-center px-10 py-5 bg-red-600 text-white rounded-2xl font-black text-xl hover:shadow-[0_0_30px_rgba(220,38,38,0.3)] transition-all duration-500 overflow-hidden"
            >
              <span className="relative z-10 uppercase tracking-widest">Locate Nearby</span>
              <div className="absolute inset-0 bg-white translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500" />
            </button>
            <button
              onClick={() => navigate("/donateBlood")}
              className="animate-appear opacity-0 scale-90 text-black bg-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-black hover:text-white transition-all border border-white/10"
            >
              Donor Portal
            </button>
          </div>

          <div className="animate-appear opacity-0 translate-y-10 mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/5 pt-12">
            <StatBlock count="25+" label="Hospitals" />
            <StatBlock count="Live" label="Syncing" border />
            <StatBlock count="10km" label="Avg Distance" border hiddenMobile />
            <StatBlock count="24/7" label="Support" border hiddenMobile />
          </div>
        </div>
      </section>

      {/* SECTION 2: THE APPEAL */}
      <section className="py-20 w-full bg-white flex items-center justify-center">
        <div className="max-w-[1400px] mx-6 w-full bg-[#0d0d0d] rounded-[3rem] p-12 md:p-24 relative overflow-hidden flex flex-col lg:flex-row items-center gap-16">
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 lg:w-3/5 space-y-8">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-red-500 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 inline-block">Be the change</span>
            <h2 className="text-5xl md:text-7xl font-black leading-none text-white tracking-tight">
              Register as a <br /> <span className="text-red-600">blood donor</span>
            </h2>
            <p className="text-gray-400 text-xl leading-relaxed max-w-xl">
              Every drop counts. By registering, you ensure help is just a few kilometers away. Join Indore's most reliable network.
            </p>
            <button
              onClick={() => navigate("/donateBlood")}
              className="group relative inline-flex items-center justify-center px-12 py-6 bg-red-600 text-white rounded-2xl font-black text-xl hover:shadow-[0_0_40px_rgba(220,38,38,0.2)] transition-all duration-500 overflow-hidden"
            >
              <span className="relative z-10 uppercase tracking-widest">Register Here</span>
              <div className="absolute inset-0 bg-white translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500" />
            </button>
          </div>

          <div className="lg:w-2/5 w-full relative group">
            <div className="absolute -inset-4 border border-white/10 rounded-[2.5rem] scale-105 group-hover:scale-100 transition-transform duration-700 pointer-events-none" />
            <img
              src="https://images.unsplash.com/photo-1542884748-2b87b36c6b90?auto=format&fit=crop&q=80&w=800"
              alt="Donation"
              className="rounded-[2rem] shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000 w-full object-cover"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-2xl hidden md:block">
              <p className="text-black text-3xl font-black">1 Pint</p>
              <p className="text-red-600 text-xs font-bold uppercase tracking-widest">Saves 3 Lives</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: INFO */}
      <section ref={infoRef} className="py-32 px-6 bg-[#f9f9f9]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-sm uppercase tracking-[0.4em] font-bold text-red-600 mb-4">How it Works</h2>
            <p className="text-5xl md:text-6xl font-black tracking-tight text-black">Your Journey to <br /> Saving a Life</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <InfoCard number="01" title="Registration" desc="Sign up with your details. Your data is encrypted and secure." />
            <InfoCard number="02" title="Quick Screening" desc="We verify eligibility to ensure both donor and recipient safety." />
            <InfoCard number="03" title="Save a Life" desc="Get alerts for urgent needs nearby. Visit and donate hope." />
          </div>

          <div className="info-card mt-20 p-12 bg-red-600 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="max-w-xl relative z-10">
              <h4 className="text-3xl font-bold mb-4">Did you know?</h4>
              <p className="text-red-100 text-lg font-medium leading-relaxed">
                Just one pint of blood can save up to three people's lives. Your contribution is the difference between despair and hope.
              </p>
            </div>
            <a href="https://www.redcrossblood.org/faq.html" className="relative z-10 px-8 py-4 bg-white text-red-600 font-black rounded-xl hover:bg-black hover:text-white transition-all">
              Medical FAQ
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0d0d0d] text-white pt-24 pb-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <h3 className="text-2xl font-black tracking-tighter">
              Blood <span className="text-red-600">Assistant.</span>
            </h3>
            <p className="text-gray-500 max-w-sm leading-relaxed font-medium">
              Indore's digital life-saving network. We leverage modern web tech
              to ensure no request for blood goes unanswered.
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-red-600">Quick Links</h4>
            <ul className="space-y-4 text-gray-400 font-medium text-sm flex flex-col">
              <li><NavLink to="/" className="hover:text-white transition-colors">Home</NavLink></li>
              <li><NavLink to="/donateBlood" className="hover:text-white transition-colors">Donate Blood</NavLink></li>
              <li><NavLink to="/bloodBanks" className="hover:text-white transition-colors">Search Banks</NavLink></li>
              <li><NavLink to="/about" className="hover:text-white transition-colors">About Us</NavLink></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-red-600">Connect</h4>
            <ul className="space-y-4 text-gray-400 font-medium text-sm">
              <li className="hover:text-white cursor-pointer transition-colors">Instagram</li>
              <li className="hover:text-white cursor-pointer transition-colors">Twitter</li>
              <li className="hover:text-white cursor-pointer transition-colors">LinkedIn</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">
            © 2026 Akash Warade. Developed for Impact.
          </p>
          <div className="flex gap-8 text-gray-600 text-[10px] font-bold uppercase tracking-widest">
            <span className="hover:text-red-600 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-red-600 cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

const StatBlock = ({ count, label, border, hiddenMobile }) => (
  <div className={`${border ? "border-l border-white/5 md:pl-8" : ""} ${hiddenMobile ? "hidden md:block" : ""}`}>
    <p className="text-4xl font-bold">{count}</p>
    <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-2 font-bold">{label}</p>
  </div>
);

const InfoCard = ({ number, title, desc }) => (
  <div className="info-card group p-10 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500">
    <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center text-3xl font-bold mb-8 group-hover:bg-red-600 group-hover:text-white transition-colors">
      {number}
    </div>
    <h3 className="text-2xl font-bold mb-4 text-black">{title}</h3>
    <p className="text-gray-500 leading-relaxed font-medium">{desc}</p>
  </div>
);