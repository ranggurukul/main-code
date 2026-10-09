import React from 'react';
import { Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { BookOpen, Calendar, Clock, ArrowRight, User } from 'lucide-react';

export interface Story {
  slug: string;
  title: string;
  category: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  coverImage: string;
  excerpt: string;
  content: string[];
}

export const STORIES_DATA: Story[] = [
  {
    slug: 'fourfold-abhinaya-natyashastra',
    title: 'The Fourfold Abhinaya: Deconstructing Bharata Muni in the 21st Century',
    category: 'Natyashastra',
    author: 'Dr. Siddharth Narayan',
    authorRole: 'Head of Dramaturgy',
    date: 'February 15, 2026',
    readTime: '6 min read',
    coverImage: '/assets/hero.jpg',
    excerpt: 'How modern physical theatre collectives can dissolve the boundary between ancient Sanskrit aesthetics and visceral political drama.',
    content: [
      'In the sixth chapter of the Natyashastra, Bharata Muni asks a deceptively simple question: What is Rasa? The answer given is not an intellectual treatise, but a culinary metaphor: Vibhava-anubhava-vyabhichari-samyogad rasa-nishpattih.',
      'Just as a master chef harmonizes distinct spices, salts, and essences to produce a singular gastronomic ecstasy, the theatrical director harmonizes bodily posture (Angika), poetic meter (Vachika), material scenography (Aharya), and spontaneous emotional tremor (Sattvika).',
      'When our ensemble rehearses on the stone floor of the Maldevta amphitheatre, we discard the European proscenium arch. The audience does not sit in detached darkness; they are co-conspirators in an energetic circle.',
    ],
  },
  {
    slug: 'lost-pigments-aharya-masks',
    title: 'The Lost Pigments: Extracting Madder Root & Indigo for Sacred Masks',
    category: 'Aharya Craft',
    author: 'Master Craftsman Biren Mahapatra',
    authorRole: 'Guild Master',
    date: 'January 28, 2026',
    readTime: '5 min read',
    coverImage: '/assets/craft.jpg',
    excerpt: 'Chemical dyes destroy the sacred resonance of theatrical masks. An exploration of ancient botanical chemistry and earthen clays.',
    content: [
      'A synthetic acrylic mask reflects light with a plastic sheen that blinds the camera and insults the stage lighting. A mask tinted with fermented indigo, turmeric paste, and pomegranate rind absorbs light, drinking in the stage spotlights like aged temple stone.',
      'Our apprentices spend their first two weeks not sculpting, but grinding. In stone mortars with heavy wooden pestles, we grind aged riverbed clay mixed with rice husk ash and neem gum to deter insects.',
      'To hold a mask crafted in this parampara is to feel the weight of centuries. It ceases to be an object; it becomes a deity waiting for an actor breath to animate it.',
    ],
  },
  {
    slug: 'dhrupad-microtones-midnight-alaap',
    title: 'Dhrupad Microtones: The Architectural Geometry of the Midnight Alaap',
    category: 'Dhrupad Acoustics',
    author: 'Ustad Farhan Dagar',
    authorRole: 'Guru of Sacred Sound',
    date: 'December 20, 2025',
    readTime: '8 min read',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Why the 22 Shrutis of Indian classical music are not arbitrary frequencies, but precise emotional coordinates for theatrical catharsis.',
    content: [
      'Sound in Indian theatre was never conceived as background score. In Sanskrit staging, the singer is situated directly behind the actor, serving as their acoustic shadow.',
      'In Raga Darbari or Raga Todi, the oscillation of the Komal Gandhar (microtonal minor third) must dip below the standard tempered piano pitch by precisely 20 cents. It is in that infinitesimal fracture that grief (Karuna) is unlocked.',
      'We train our vocalists at 4:30 AM in the Kharaj register. When thirty voices resonate at fundamental sub-bass frequencies, the stone pavilion begins to vibrate in sympathetic resonance.',
    ],
  },
];

import { useDatabase } from '../context/DatabaseContext';

export const StoriesPage: React.FC = () => {
  const { stories } = useDatabase();
  const activeStories = stories && stories.length > 0 ? stories : STORIES_DATA;

  return (
    <PageTransition>
      <section className="pt-36 pb-16 px-4 sm:px-6 lg:px-12 bg-[#161412] border-b border-[#2b2723]">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold block mb-2 font-mono">
            The Cultural Journal • रंग पत्रिका
          </span>
          <h1 className="font-editorial text-4xl sm:text-6xl text-[#faf7f2] font-bold">
            Monographs, Essays & Living Lore
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#d8d0c5] max-w-2xl font-light leading-relaxed">
            Scholarly treatises on Natyashastra dramaturgy, botanical dye extraction, microtonal
            acoustics, and interviews authored by our resident masters and interns.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-12 bg-[#121110]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {activeStories.map((story) => (
            <article
              key={story.slug}
              className="theatre-card rounded-2xl overflow-hidden border border-[#332f2a] flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter contrast-105"
                  />
                  <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-[#121110]/85 border border-[#d4af37]/40 text-[#d4af37] text-[10px] font-semibold uppercase tracking-wider">
                    {story.category}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 text-[11px] text-[#9e968b] mb-2">
                    <span>{story.date}</span>
                    <span>•</span>
                    <span>{story.readTime}</span>
                  </div>
                  <h2 className="font-editorial text-xl font-bold text-[#faf7f2] group-hover:text-[#d4af37] transition-colors leading-snug">
                    {story.title}
                  </h2>
                  <p className="mt-3 text-xs text-[#9e968b] leading-relaxed line-clamp-3">
                    {story.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-[#25221e] flex items-center justify-between text-xs">
                <span className="text-[#d8d0c5] font-medium">{story.author}</span>
                <Link
                  to={`/stories/${story.slug}`}
                  className="text-[#d4af37] group-hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageTransition>
  );
};
