import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { STORIES_DATA } from './StoriesPage';
import { ArrowLeft, Calendar, Clock, User, Share2, BookOpen } from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';

export const StoryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { stories } = useDatabase();
  const activeStories = stories && stories.length > 0 ? stories : STORIES_DATA;
  const story = activeStories.find((s) => s.slug === slug) || activeStories[0];

  return (
    <PageTransition>
      <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-12 bg-[#161412] border-b border-[#2b2723]">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/stories"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#9e968b] hover:text-[#d4af37] transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Stories</span>
          </Link>

          <span className="text-xs uppercase font-mono tracking-widest text-[#c85a32] block mb-2 font-semibold">
            {story.category} Monograph
          </span>

          <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[#faf7f2] leading-tight">
            {story.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-[#9e968b] pb-6 border-b border-[#2b2723]">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#d4af37]" />
              <span className="text-[#faf7f2] font-medium">{story.author} ({story.authorRole})</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#d4af37]" />
              <span>{story.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#d4af37]" />
              <span>{story.readTime}</span>
            </div>
          </div>
        </div>
      </div>

      <article className="py-16 px-4 sm:px-6 lg:px-12 bg-[#121110]">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl overflow-hidden border border-[#332f2a] mb-12 shadow-2xl">
            <img
              src={story.coverImage}
              alt={story.title}
              className="w-full h-80 sm:h-96 object-cover filter contrast-105"
            />
          </div>

          <div className="space-y-6 text-[#d8d0c5] text-sm sm:text-base leading-relaxed font-light font-sans-clean">
            {story.content.map((paragraph, idx) => (
              <p key={idx} className="first-letter:text-4xl first-letter:font-editorial first-letter:text-[#d4af37] first-letter:mr-2 first-letter:float-left">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-14 pt-8 border-t border-[#2b2723] flex items-center justify-between">
            <Link
              to="/stories"
              className="text-xs uppercase tracking-widest text-[#d4af37] hover:underline font-semibold"
            >
              ← Return to Cultural Journal
            </Link>

            <Link
              to="/subscribe"
              className="px-5 py-2.5 rounded-xl bg-[#282522] hover:bg-[#d4af37] hover:text-[#121110] text-[#faf7f2] text-xs font-semibold uppercase tracking-wider transition-all"
            >
              Subscribe for Next Monograph
            </Link>
          </div>
        </div>
      </article>
    </PageTransition>
  );
};
