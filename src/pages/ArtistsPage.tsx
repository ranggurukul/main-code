import React from 'react';
import { Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { ArrowRight, Award, Sparkles } from 'lucide-react';

export interface Artist {
  id: string;
  name: string;
  sanskritTitle: string;
  discipline: string;
  role: string;
  image: string;
  bio: string;
  quote: string;
  honors: string[];
}

export const ARTISTS_LIST: Artist[] = [
  {
    id: 'anuradha-sen',
    name: 'Padmashri Anuradha Sen',
    sanskritTitle: 'नाट्य गुरु',
    discipline: 'Classical & Contemporary Theatre',
    role: 'Artistic Director & Dean of Staging',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    bio: 'Padmashri awardee and four-decade stalwart of Indian physical dramaturgy. Trained at the National School of Drama and under the Kudiyattam masters of Kerala, Anuradha Sen has directed over 40 landmark productions presented at the Barbican, Edinburgh, and Avignon.',
    quote: 'The actor is not an imitator of reality, but an incendiary flame illuminating the unseen.',
    honors: ['Padma Shri 2018', 'Sangeet Natak Akademi Award for Direction', 'Kalidas Samman'],
  },
  {
    id: 'devrat-joshi',
    name: 'Maestro Devrat Joshi',
    sanskritTitle: 'अभिनय शिरोमणि',
    discipline: 'Physical Theatre & Chhau Vanguard',
    role: 'Repertoire Master & Principal Performer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    bio: 'Celebrated for his breathtaking portrayal of Karna in The Celestial Loom. Pioneer of merging Seraikella Chhau martial balance with contemporary text deconstruction.',
    quote: 'Movement without breath is gymnastics; movement with rasa is prayer.',
    honors: ['Mahindra Excellence in Theatre Awards (META) Best Actor', 'Ustad Bismillah Khan Yuva Puraskar'],
  },
  {
    id: 'farhan-dagar',
    name: 'Ustad Farhan Dagar',
    sanskritTitle: 'नाद ब्रह्म साधक',
    discipline: 'Dhrupad, Pakhawaj & Sacred Acoustics',
    role: 'Head of Acoustics & Vocal Sadhana',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    bio: 'Senior exponent of the Dagarvani Dhrupad tradition. Master of microtonal pitch articulation and dawn Kharaj meditation, crafting ambient acoustic architecture for all Gurukul stagings.',
    quote: 'The silence between two beats of the Pakhawaj holds the entire universe.',
    honors: ['Tansen Samman', 'All India Radio Top Grade Artist'],
  },
  {
    id: 'biren-mahapatra',
    name: 'Master Craftsman Biren Mahapatra',
    sanskritTitle: 'आहार्य शिल्पी',
    discipline: 'Ceremonial Masks & Botanical Pigments',
    role: 'Guild Master of Aharya Arts',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
    bio: 'Fifth-generation ceremonial mask sculptor from Odisha. Preserver of natural vegetable dye chemistry, papier-mâché layering, and sacred temple iconography.',
    quote: 'To place on a mask is to surrender the mortal ego to a mythic divinity.',
    honors: ['National Master Craftsman Heritage Award', 'Living Human Treasure Citation'],
  },
  {
    id: 'ramdas-bhatt',
    name: 'Sutradhar Ramdas Bhatt',
    sanskritTitle: 'सूत्रधार',
    discipline: 'Shadow Puppetry & Oral Ballads',
    role: 'Master of Folk Narratives',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    bio: 'Keeper of the ancient Tholu Bommalata leather shadow tradition. Balladeer and puppeteer who brings 10-headed epics alive through light, flame, and oral improvisation.',
    quote: 'In the hands of the puppeteer, wood breathes and leather speaks epics.',
    honors: ['Folk Heritage Internship', 'Sangeet Natak Akademi Tagor Puraskar'],
  },
  {
    id: 'vani-pillai',
    name: 'Vani Pillai',
    sanskritTitle: 'नृत्य विदुषी',
    discipline: 'Classical Movement & Kudiyattam',
    role: 'Senior Movement Faculty',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    bio: 'Trained under the greatest living masters of Kudiyattam and Bharatanatyam. Renowned for Netra-Vyayama eye isolations and portraying complex female mythological archetypes.',
    quote: 'Where the hand goes, the gaze must follow; where the gaze goes, the soul awakens.',
    honors: ['Kerala Sangeetha Nataka Akademi Award', 'Senior Internship in Classical Theatre'],
  },
];

export const ArtistsPage: React.FC = () => {
  return (
    <PageTransition>
      {/* Top Banner */}
      <section className="pt-36 pb-16 px-4 sm:px-6 lg:px-12 bg-[#161412] border-b border-[#2b2723]">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block mb-2 font-mono">
            Parampara Masters & Ensemble
          </span>
          <h1 className="font-editorial text-4xl sm:text-6xl text-[#faf7f2] font-bold">
            The Living Gurus & Artists
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#d8d0c5] max-w-2xl font-light leading-relaxed">
            The soul of Rang Gurukul resides in its lineage of practitioners. Meet the Padmashri
            awardees, hereditary guild craftsmen, and vanguard actors guiding our disciples.
          </p>
        </div>
      </section>

      {/* Artists Catalog */}
      <section className="py-20 px-4 sm:px-6 lg:px-12 bg-[#121110]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ARTISTS_LIST.map((artist) => (
            <div
              key={artist.id}
              className="theatre-card rounded-2xl overflow-hidden border border-[#332f2a] flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 filter contrast-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-transparent to-transparent opacity-80" />
                  <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-[#121110]/85 border border-[#d4af37]/40 text-[#d4af37] text-[10px] font-mono font-semibold">
                    {artist.sanskritTitle}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[10px] uppercase font-semibold text-[#c85a32] block">
                      {artist.discipline}
                    </span>
                    <h3 className="font-editorial text-2xl font-bold text-[#faf7f2] group-hover:text-[#d4af37] transition-colors">
                      {artist.name}
                    </h3>
                  </div>
                </div>

                <div className="p-6">
                  <span className="text-xs text-[#d4af37] font-medium block mb-2">
                    {artist.role}
                  </span>
                  <p className="text-xs text-[#9e968b] leading-relaxed line-clamp-3">
                    {artist.bio}
                  </p>

                  <div className="mt-4 pt-4 border-t border-[#25221e] italic text-[11px] text-[#d8d0c5]">
                    "{artist.quote}"
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  to={`/artists/${artist.id}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#282522] hover:bg-[#d4af37] hover:text-[#121110] text-[#faf7f2] text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                >
                  <span>View Full Profile</span>
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
