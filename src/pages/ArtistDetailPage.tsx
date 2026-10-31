import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { ARTISTS_LIST } from './ArtistsPage';
import { ArrowLeft, Award, BookOpen } from 'lucide-react';

export const ArtistDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const artist = ARTISTS_LIST.find((a) => a.id === id) || ARTISTS_LIST[0];

  return (
    <PageTransition>
      <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-12 bg-[#161412] border-b border-[#2b2723]">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/artists"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#9e968b] hover:text-[#d4af37] transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Masters</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden border border-[#d4af37]/40 shadow-2xl">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-96 object-cover object-top filter contrast-105"
                />
              </div>
            </div>

            <div className="lg:col-span-7">
              <span className="text-xs uppercase font-mono tracking-widest text-[#c85a32] block mb-1">
                {artist.sanskritTitle} • {artist.discipline}
              </span>
              <h1 className="font-editorial text-4xl sm:text-6xl text-[#faf7f2] font-bold">
                {artist.name}
              </h1>
              <div className="text-base sm:text-lg text-[#d4af37] font-medium mt-2">
                {artist.role}
              </div>

              <blockquote className="my-6 p-5 rounded-2xl bg-[#1f1c19] border-l-4 border-[#d4af37] text-sm text-[#d8d0c5] italic leading-relaxed">
                "{artist.quote}"
              </blockquote>

              <p className="text-sm text-[#d8d0c5] leading-relaxed font-light">
                {artist.bio}
              </p>

              <div className="mt-8">
                <h3 className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold mb-3">
                  Honors & Recognitions
                </h3>
                <div className="flex flex-wrap gap-2">
                  {artist.honors.map((h, i) => (
                    <span
                      key={i}
                      className="px-3.5 py-1.5 rounded-xl bg-[#201e1b] border border-[#332f2a] text-xs text-[#faf7f2] flex items-center gap-2"
                    >
                      <Award className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>{h}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
