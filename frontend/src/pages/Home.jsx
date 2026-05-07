"use client";
import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const containerRef = useRef(null);
  const infoRef = useRef(null);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    // Register inside effect to ensure it's client-side
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Hero Entrance Animations
      gsap.from(".animate-text", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out",
      });

      gsap.to(".animate-appear", {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        delay: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)",
      });

      // 2. Background Pulse
      gsap.to(".bg-pulse", {
        scale: 1.2,
        opacity: 0.4,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // 3. FIXED ScrollTrigger Logic
      // We target the cards specifically
      gsap.from(".info-card", {
        scrollTrigger: {
          trigger: infoRef.current, // Use the section as the boundary
          start: "top 75%", // Trigger when the top of section hits 75% of viewport
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true,
        },
        y: 80,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out",
      });
    }, containerRef);

    // This is crucial for cleaning up ScrollTriggers
    return () => {
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

        <div className="max-w-6xl w-full text-center relative z-10">
          <div className="animate-text inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-red-600 animate-ping"></span>
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-red-500">
              Real-Time Network Active
            </span>
          </div>

          <h1 className="animate-text text-5xl md:text-8xl font-black leading-[1.1] mb-8 tracking-tight">
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
              className="animate-appear opacity-0 scale-90 group relative inline-flex items-center justify-center px-10 py-5 bg-red-600 text-white rounded-2xl font-black text-xl hover:bg-white hover:text-red-600 transition-all duration-500 shadow-2xl overflow-hidden"
            >
              <span className="relative z-10 uppercase tracking-widest">
                Locate Nearby
              </span>
              <div className="absolute inset-0 bg-white translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500" />
            </button>
            <button
              onClick={() => navigate("/donateBlood")}
              className="animate-appear opacity-0 scale-90 text-[#000] bg-white  w-max-content sm:w-auto px-10 py-5 border border-white/10 rounded-2xl font-bold text-lg hover:bg-black hover:text-white transition-all"
            >
              Donor Portal
            </button>
          </div>

          <div className="animate-appear opacity-0 translate-y-10 mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/5 pt-12 text-white">
            <StatBlock count="120+" label="Hospitals" />
            <StatBlock count="Live" label="Syncing" border />
            <StatBlock count="2.4km" label="Avg Distance" border hiddenMobile />
            <StatBlock
              count="24/7"
              label="Emergency Support"
              border
              hiddenMobile
            />
          </div>
        </div>
      </section>

      {/* SECTION 2: THE APPEAL SECTION */}
      <section className="min-h-[80vh] w-full bg-white flex items-center justify-center mt-10">
        <div className="max-w-9xl w-full bg-[#0d0d0d] p-8 md:p-16 lg:p-24 relative overflow-hidden flex flex-col lg:flex-row items-center gap-16">
          {/* Animated Background Glows */}
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[100px] rounded-full pointer-events-none" />

          {/* LEFT CONTENT: Text & CTA */}
          <div className="relative z-10 lg:w-3/5 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-red-500">
                Be the change
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black leading-[1.1] text-white tracking-tight">
              Register as a <span className="text-red-600">blood <br /> donor</span>{" "}
              and become <br />a hero.
            </h2>

            <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-xl">
              Every drop counts. By registering, you ensure that help is always
              just a few kilometers away. Join Indore's most reliable network of
              life-savers.
            </p>

            <div className="pt-4">
              <button
                onClick={() => navigate("/donateBlood")}
                className="group relative inline-flex items-center justify-center px-12 py-6 bg-red-600 text-white rounded-2xl font-black text-xl hover:bg-white hover:text-red-600 transition-all duration-500 shadow-2xl overflow-hidden"
              >
                <span className="relative z-10 uppercase tracking-widest">
                  Register Here
                </span>
                <div className="absolute inset-0 bg-white translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500" />
              </button>
            </div>
          </div>

          {/* RIGHT CONTENT: High-Impact Image */}
          <div className="relative lg:w-2/5 w-full flex justify-center lg:justify-end">
            <div className="relative group max-w-lg">
              {/* Decorative elements for the image */}
              <div className="absolute -inset-4 border border-white/10 rounded-[2.5rem] scale-105 group-hover:scale-100 transition-transform duration-700 pointer-events-none" />

              <img
                src="https://images.unsplash.com/photo-1542884748-2b87b36c6b90?auto=format&fit=crop&q=80&w=800"
                alt="Hands joining together"
                className="rounded-[2rem] shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000 object-cover aspect-[5/5] lg:aspect-auto"
              />

              {/* Floating Stat Chip over image */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-2xl hidden md:block">
                <p className="text-black text-3xl font-black">1 Pint</p>
                <p className="text-red-600 text-xs font-bold uppercase tracking-widest">
                  Saves 3 Lives
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: INFORMATION SECTION */}
      <section ref={infoRef} className="py-32 px-6 bg-[#f9f9f9] text-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-sm uppercase tracking-[0.4em] font-bold text-red-600 mb-4">
              How it Works
            </h2>
            <p className="text-4xl md:text-6xl font-black tracking-tight">
              Your Journey to <br />
              Saving a Life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <InfoCard
              number="01"
              title="Registration"
              desc="Sign up on our portal with your basic details and blood group. Your data is encrypted and secure."
            />
            <InfoCard
              number="02"
              title="Quick Screening"
              desc="We verify your eligibility based on health standards to ensure both the donor and recipient stay safe."
            />
            <InfoCard
              number="03"
              title="Save a Life"
              desc="Receive a notification when there's an urgent requirement nearby. Visit the hospital and donate hope."
            />
          </div>

          <div className="info-card mt-20 p-12 bg-red-600 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="max-w-xl relative z-10">
              <h4 className="text-3xl font-bold mb-4">Did you know?</h4>
              <p className="text-red-100 text-lg">
                Just one pint of blood can save up to three people's lives. Your
                contribution is the difference between despair and hope.
              </p>
            </div>
            <button className="relative z-10 px-8 py-4 bg-white text-red-600 font-black rounded-xl hover:bg-black hover:text-white transition-all active:scale-95">
              Read Medical FAQ
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-[#0d0d0d] text-white pt-24 pb-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <h3 className="text-2xl font-black tracking-tighter">
              Blood <span className="text-red-600">Assistant.</span>
            </h3>
            <p className="text-gray-500 max-w-sm leading-relaxed">
              Indore's digital life-saving network. We leverage modern web tech
              to ensure no request for blood goes unanswered.
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-red-600">
              Quick Links
            </h4>
            <ul className="space-y-4 text-gray-400 font-medium text-sm">
              <li className="hover:text-white cursor-pointer transition-colors">
                Home
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                Donate Blood
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                Search Banks
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                About Us
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-red-600">
              Connect
            </h4>
            <ul className="space-y-4 text-gray-400 font-medium text-sm">
              <li className="hover:text-white cursor-pointer transition-colors">
                Instagram
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                Twitter
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                LinkedIn
              </li>
              <li className="hover:text-white cursor-pointer transition-colors">
                Contact Support
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-600 text-xs font-bold uppercase tracking-widest">
            © 2026 Akash Warade. Developed for Impact.
          </p>
          <div className="flex gap-8 text-gray-600 text-xs font-bold uppercase tracking-widest">
            <span className="hover:text-red-600 cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-red-600 cursor-pointer">
              Terms of Service
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

const StatBlock = ({ count, label, border, hiddenMobile }) => (
  <div
    className={`${border ? "border-l border-white/5 md:pl-8" : ""} ${hiddenMobile ? "hidden md:block" : ""}`}
  >
    <p className="text-3xl font-bold">{count}</p>
    <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
      {label}
    </p>
  </div>
);

const InfoCard = ({ number, title, desc }) => (
  <div className="info-card group p-10 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500">
    <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center text-3xl font-bold mb-8 group-hover:bg-red-600 group-hover:text-white transition-colors">
      {number}
    </div>
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <p className="text-gray-500 leading-relaxed">{desc}</p>
  </div>
);
