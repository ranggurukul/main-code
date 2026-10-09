import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { useDatabase } from '../context/DatabaseContext';
import { Calendar, Clock, MapPin, Users, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const WorkshopsPage: React.FC = () => {
  const { workshops } = useDatabase();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Theatre', 'Movement', 'Music', 'Crafts', 'Puppetry'];

  const filtered = selectedCategory === 'All'
    ? workshops
    : workshops.filter((w) => w.category === selectedCategory);

  return (
    <PageTransition>
      {/* Banner */}
      <section className="pt-36 pb-16 px-4 sm:px-6 lg:px-12 bg-[#161412] border-b border-[#2b2723]">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block mb-2 font-mono">
            Parampara Immersions • 2026–2027
          </span>
          <h1 className="font-editorial text-4xl sm:text-6xl text-[#faf7f2] font-bold">
            Paid Masterclasses & Artisanal Studios
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#d8d0c5] max-w-2xl font-light leading-relaxed">
            Direct apprenticeships guided by living legends. From Natyashastra kinetic dramaturgy
            and Chhau mask sculpting to contemplative Dhrupad naad sadhana.
          </p>

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border ${
                  selectedCategory === cat
                    ? 'border-[#d4af37] bg-[#2a2622] text-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.2)]'
                    : 'border-[#332f2a] bg-[#1a1816] text-[#9e968b] hover:text-[#faf7f2]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Catalog Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-12 bg-[#121110]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((ws) => (
            <div
              key={ws.id}
              className="theatre-card rounded-2xl overflow-hidden border border-[#332f2a] flex flex-col justify-between group hover:border-[#d4af37]/50"
            >
              <div>
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={ws.image}
                    alt={ws.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-transparent to-transparent opacity-70" />

                  {/* Price Tag */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#121110]/90 border border-[#d4af37]/50 text-[#d4af37] font-mono text-xs font-bold shadow-lg">
                    ₹{ws.price.toLocaleString('en-IN')}
                  </div>

                  {/* Status Badge */}
                  <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-[#c85a32]/90 text-[#faf7f2] text-[10px] font-semibold uppercase tracking-wider">
                    {ws.status} • {ws.availableSeats} Seats Available
                  </div>
                </div>

                <div className="p-6">
                  <div className="text-[11px] uppercase tracking-wider text-[#d4af37] font-semibold mb-1">
                    Mentor: {ws.instructor}
                  </div>
                  <h3 className="font-editorial text-xl font-bold text-[#faf7f2] group-hover:text-[#d4af37] transition-colors leading-snug">
                    {ws.title}
                  </h3>
                  <p className="mt-1 text-xs text-[#c85a32] font-medium">
                    {ws.subtitle}
                  </p>
                  <p className="mt-3 text-xs text-[#9e968b] leading-relaxed line-clamp-3">
                    {ws.description}
                  </p>

                  <div className="mt-5 pt-4 border-t border-[#25221e] space-y-2 text-xs text-[#9e968b]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>{ws.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>{ws.duration} ({ws.time})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>{ws.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  to={`/workshops/${ws.id}`}
                  className="w-full py-3 px-4 rounded-xl bg-[#282522] hover:bg-[#d4af37] hover:text-[#121110] text-[#faf7f2] text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <span>View Syllabus & Register</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageTransition>
  );
};
