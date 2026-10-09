import React, { useState, useEffect } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Calendar,
  MapPin,
  Ticket,
  Sparkles,
  X,
  Check,
  Users,
  Award,
  Globe,
  Clock,
  Layers,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  RefreshCw,
  Save,
  CheckCircle2,
  Quote,
} from 'lucide-react';
import type { Production, TourDate } from '../../types/database';
import { MediaUploadField } from '../../components/media/MediaUploadField';

export const AdminEventsView: React.FC = () => {
  const {
    events,
    saveEvent,
    deleteEvent,
    tourDates,
    saveTourDate,
    deleteTourDate,
    siteSettings,
    updateSiteSettings,
  } = useDatabase();

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<'productions' | 'tour_dates' | 'reservation_options'>('productions');

  // Productions State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [editingItem, setEditingItem] = useState<Partial<Production> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Structured Cast & Accolades editor state inside modal
  const [modalCast, setModalCast] = useState<{ role: string; actor: string }[]>([]);
  const [modalAccolades, setModalAccolades] = useState<string[]>([]);
  const [newCastRole, setNewCastRole] = useState('');
  const [newCastActor, setNewCastActor] = useState('');
  const [newAccoladeInput, setNewAccoladeInput] = useState('');
  const [bulkCastInput, setBulkCastInput] = useState('');
  const [showBulkCast, setShowBulkCast] = useState(false);

  // Tour Dates State
  const [tourSearchTerm, setTourSearchTerm] = useState('');
  const [editingTourDate, setEditingTourDate] = useState<Partial<TourDate> | null>(null);
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const [deleteTourConfirmId, setDeleteTourConfirmId] = useState<string | null>(null);

  // Reservation Options State
  const defaultCities = [
    'New Delhi',
    'Mumbai',
    'London',
    'Bengaluru',
    'Varanasi',
    'Dehradun',
  ];

  const defaultTiers = [
    { name: 'Royal Patron Box', price: 3200 },
    { name: 'Grand Circle Stalls', price: 1600 },
    { name: 'Amphitheatre Earthen Tier', price: 850 },
    { name: 'Student / Artist Concession', price: 450 },
  ];

  const [resCities, setResCities] = useState<string[]>(() => {
    if (Array.isArray(siteSettings.reservationCities)) {
      return [...siteSettings.reservationCities];
    }
    return [...defaultCities];
  });

  const [resTiers, setResTiers] = useState<{ name: string; price: number }[]>(() => {
    if (Array.isArray(siteSettings.reservationTiers)) {
      return [...siteSettings.reservationTiers];
    }
    return [...defaultTiers];
  });

  const [newCityInput, setNewCityInput] = useState('');
  const [newTierName, setNewTierName] = useState('');
  const [newTierPrice, setNewTierPrice] = useState<number | ''>('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  useEffect(() => {
    if (Array.isArray(siteSettings.reservationCities)) {
      setResCities([...siteSettings.reservationCities]);
    }
  }, [siteSettings.reservationCities]);

  useEffect(() => {
    if (Array.isArray(siteSettings.reservationTiers)) {
      setResTiers([...siteSettings.reservationTiers]);
    }
  }, [siteSettings.reservationTiers]);

  const statuses = ['All', 'Now Touring', 'Upcoming Premiere', 'In Rehearsal', 'Archival Vault'];

  // Filtering productions
  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.genre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || e.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Filtering tour dates
  const filteredTourDates = tourDates.filter((t) => {
    const q = tourSearchTerm.toLowerCase();
    return (
      t.city.toLowerCase().includes(q) ||
      t.country.toLowerCase().includes(q) ||
      t.hall.toLowerCase().includes(q) ||
      t.production.toLowerCase().includes(q) ||
      t.dates.toLowerCase().includes(q)
    );
  });

  // Open Add Production Modal
  const handleOpenAdd = () => {
    setEditingItem({
      title: '',
      subTitle: '',
      genre: 'Physical Dance-Theatre & Live Dhrupad',
      director: 'Anuradha Sen',
      playwright: 'Dr. Siddharth Narayan',
      duration: '110 minutes (with interval)',
      status: 'Upcoming Premiere',
      statusColor: '#D4AF37',
      season: '2026–2027 Season',
      venue: 'Kamani Auditorium, New Delhi & Barbican Center, London',
      dates: 'October 2026',
      synopsis: '',
      directorNote: '',
      cast: [],
      accolades: [],
      bannerImage: '/assets/hero.jpg',
      ticketPrice: '₹750 – ₹3,200 / £25 – £65',
    });
    setModalCast([]);
    setModalAccolades([]);
    setNewCastRole('');
    setNewCastActor('');
    setNewAccoladeInput('');
    setBulkCastInput('');
    setShowBulkCast(false);
    setIsModalOpen(true);
  };

  // Open Edit Production Modal
  const handleOpenEdit = (item: Production) => {
    setEditingItem({ ...item });
    setModalCast(Array.isArray(item.cast) ? [...item.cast] : []);
    setModalAccolades(Array.isArray(item.accolades) ? [...item.accolades] : []);
    setNewCastRole('');
    setNewCastActor('');
    setNewAccoladeInput('');
    setBulkCastInput((item.cast || []).map((c) => `${c.role}: ${c.actor}`).join('\n'));
    setShowBulkCast(false);
    setIsModalOpen(true);
  };

  // Cast management helpers
  const handleAddCastMember = () => {
    if (!newCastRole.trim() || !newCastActor.trim()) return;
    setModalCast([...modalCast, { role: newCastRole.trim(), actor: newCastActor.trim() }]);
    setNewCastRole('');
    setNewCastActor('');
  };

  const handleRemoveCastMember = (idx: number) => {
    setModalCast(modalCast.filter((_, i) => i !== idx));
  };

  const handleEditCastMember = (idx: number, role: string, actor: string) => {
    const updated = [...modalCast];
    updated[idx] = { role, actor };
    setModalCast(updated);
  };

  const handleImportBulkCast = () => {
    if (!bulkCastInput.trim()) return;
    const parsed = bulkCastInput
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => {
        const parts = l.split(':');
        return {
          role: parts[0]?.trim() || 'Role',
          actor: parts[1]?.trim() || parts[0]?.trim() || 'Actor',
        };
      });
    setModalCast(parsed);
    setShowBulkCast(false);
  };

  // Accolades management helpers
  const handleAddAccolade = () => {
    if (!newAccoladeInput.trim()) return;
    setModalAccolades([...modalAccolades, newAccoladeInput.trim()]);
    setNewAccoladeInput('');
  };

  const handleRemoveAccolade = (idx: number) => {
    setModalAccolades(modalAccolades.filter((_, i) => i !== idx));
  };

  const handleEditAccolade = (idx: number, val: string) => {
    const updated = [...modalAccolades];
    updated[idx] = val;
    setModalAccolades(updated);
  };

  const handleMoveAccolade = (idx: number, dir: 'up' | 'down') => {
    const target = dir === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= modalAccolades.length) return;
    const copy = [...modalAccolades];
    const temp = copy[idx];
    copy[idx] = copy[target];
    copy[target] = temp;
    setModalAccolades(copy);
  };

  // Save Production
  const handleSaveProduction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.title?.trim()) return;

    saveEvent({
      ...editingItem,
      title: editingItem.title.trim(),
      subTitle: editingItem.subTitle?.trim() || '',
      director: editingItem.director?.trim() || 'Anuradha Sen',
      playwright: editingItem.playwright?.trim() || 'Rang Gurukul',
      genre: editingItem.genre?.trim() || 'Classical Theatre',
      duration: editingItem.duration?.trim() || '110 minutes',
      season: editingItem.season?.trim() || 'Season 2026–2027',
      venue: editingItem.venue?.trim() || 'Kamani Auditorium, New Delhi',
      dates: editingItem.dates?.trim() || 'Upcoming',
      ticketPrice: editingItem.ticketPrice?.trim() || '₹750 – ₹3,200',
      synopsis: editingItem.synopsis?.trim() || '',
      directorNote: editingItem.directorNote?.trim() || '',
      bannerImage: editingItem.bannerImage?.trim() || '/assets/hero.jpg',
      cast: modalCast,
      accolades: modalAccolades,
    });

    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDeleteProduction = (id: string) => {
    deleteEvent(id);
    setDeleteConfirmId(null);
  };

  // Tour Dates Handlers
  const handleOpenAddTour = () => {
    setEditingTourDate({
      city: '',
      country: 'India',
      hall: '',
      production: events[0]?.title || 'The Celestial Loom (Vichitra)',
      dates: '',
      time: '19:00 IST',
      availableTickets: 50,
      priceRange: '₹800 – ₹3,000',
      status: 'Selling Fast',
    });
    setIsTourModalOpen(true);
  };

  const handleOpenEditTour = (item: TourDate) => {
    setEditingTourDate({ ...item });
    setIsTourModalOpen(true);
  };

  const handleSaveTourDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTourDate || !editingTourDate.city?.trim() || !editingTourDate.production?.trim()) return;

    saveTourDate({
      ...editingTourDate,
      city: editingTourDate.city.trim(),
      country: editingTourDate.country?.trim() || 'India',
      hall: editingTourDate.hall?.trim() || 'Main Stage',
      production: editingTourDate.production.trim(),
      dates: editingTourDate.dates?.trim() || 'Dates TBA',
      time: editingTourDate.time?.trim() || '19:00 IST',
      availableTickets: Number(editingTourDate.availableTickets) || 30,
      priceRange: editingTourDate.priceRange?.trim() || '₹800 – ₹3,000',
      status: (editingTourDate.status as TourDate['status']) || 'Selling Fast',
    });

    setIsTourModalOpen(false);
    setEditingTourDate(null);
  };

  const handleDeleteTourDate = (id: string) => {
    deleteTourDate(id);
    setDeleteTourConfirmId(null);
  };

  // Reservation Options Handlers
  const handleAddCity = () => {
    if (!newCityInput.trim()) return;
    const updated = [...resCities, newCityInput.trim()];
    setResCities(updated);
    setNewCityInput('');
    updateSiteSettings({ reservationCities: updated });
  };

  const handleRemoveCity = (index: number) => {
    const updated = resCities.filter((_, i) => i !== index);
    setResCities(updated);
    updateSiteSettings({ reservationCities: updated });
  };

  const handleClearAllCities = () => {
    setResCities([]);
    updateSiteSettings({ reservationCities: [] });
  };

  const handleResetCities = () => {
    setResCities([...defaultCities]);
    updateSiteSettings({ reservationCities: [...defaultCities] });
  };

  const handleAddTier = () => {
    if (!newTierName.trim() || newTierPrice === '' || Number(newTierPrice) <= 0) return;
    const updated = [...resTiers, { name: newTierName.trim(), price: Number(newTierPrice) }];
    setResTiers(updated);
    setNewTierName('');
    setNewTierPrice('');
    updateSiteSettings({ reservationTiers: updated });
  };

  const handleRemoveTier = (index: number) => {
    const updated = resTiers.filter((_, i) => i !== index);
    setResTiers(updated);
    updateSiteSettings({ reservationTiers: updated });
  };

  const handleClearAllTiers = () => {
    setResTiers([]);
    updateSiteSettings({ reservationTiers: [] });
  };

  const handleResetTiers = () => {
    setResTiers([...defaultTiers]);
    updateSiteSettings({ reservationTiers: [...defaultTiers] });
  };

  const handleSaveAllReservationOptions = () => {
    updateSiteSettings({
      reservationCities: resCities,
      reservationTiers: resTiers,
    });
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3500);
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#25221e]">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 block mb-1">
            SEASON REPERTOIRE • रंगमंच प्रस्तुति
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-editorial">
            Events & Staged Productions
          </h2>
          <p className="text-xs text-[#9e968b] mt-1">
            Manage productions, director notes, accolades, full cast lists, world tour dates, and pass reservation options.
          </p>
        </div>

        {activeTab === 'productions' && (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs tracking-wider uppercase transition-colors shrink-0 shadow-lg shadow-amber-400/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event / Production</span>
          </button>
        )}

        {activeTab === 'tour_dates' && (
          <button
            onClick={handleOpenAddTour}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs tracking-wider uppercase transition-colors shrink-0 shadow-lg shadow-amber-400/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Tour Stop</span>
          </button>
        )}

        {activeTab === 'reservation_options' && (
          <button
            onClick={handleSaveAllReservationOptions}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs tracking-wider uppercase transition-colors shrink-0 shadow-lg shadow-emerald-500/20"
          >
            <Save className="w-4 h-4" />
            <span>Save All Reservation Options</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#25221e] pb-px">
        <button
          onClick={() => setActiveTab('productions')}
          className={`px-4 py-2.5 text-xs uppercase tracking-wider font-semibold rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'productions'
              ? 'border-amber-400 text-amber-400 bg-[#201e1b]'
              : 'border-transparent text-[#9e968b] hover:text-white hover:bg-[#1a1816]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Productions Repertoire ({events.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tour_dates')}
          className={`px-4 py-2.5 text-xs uppercase tracking-wider font-semibold rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'tour_dates'
              ? 'border-amber-400 text-amber-400 bg-[#201e1b]'
              : 'border-transparent text-[#9e968b] hover:text-white hover:bg-[#1a1816]'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Tour Dates & Stops ({tourDates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reservation_options')}
          className={`px-4 py-2.5 text-xs uppercase tracking-wider font-semibold rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
            activeTab === 'reservation_options'
              ? 'border-amber-400 text-amber-400 bg-[#201e1b]'
              : 'border-transparent text-[#9e968b] hover:text-white hover:bg-[#1a1816]'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>Pass Reservation Options</span>
        </button>
      </div>

      {/* TAB 1: PRODUCTIONS REPERTOIRE */}
      {activeTab === 'productions' && (
        <div className="space-y-6">
          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141210] p-3 rounded-xl border border-[#2b2723]">
            <div className="flex items-center gap-2.5 flex-1 text-xs">
              <Search className="w-4 h-4 text-[#787168]" />
              <input
                type="text"
                placeholder="Search events by title, venue, director, or genre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-white placeholder-[#787168] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {statuses.map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-colors shrink-0 ${
                    selectedStatus === st
                      ? 'bg-amber-400 text-black'
                      : 'bg-[#201e1b] text-[#9e968b] hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Productions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEvents.map((prod) => (
              <div
                key={prod.id}
                className="bg-[#181614] border border-[#2b2723] rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-amber-500/50 transition-all duration-300"
              >
                <div>
                  {/* Image Banner */}
                  <div className="relative h-56 overflow-hidden bg-[#11100f]">
                    <img
                      src={prod.bannerImage || '/assets/hero.jpg'}
                      alt={prod.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#181614] via-transparent to-black/30" />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-sm border border-amber-400/40 text-amber-300 text-[10px] font-semibold uppercase tracking-wider">
                      {prod.status}
                    </div>
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-sm border border-[#332f2a] text-[#d8d0c5] text-[10px] font-mono">
                      {prod.genre}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-amber-200">
                      <span className="font-semibold">{prod.ticketPrice}</span>
                      <span className="text-[#9e968b]">{prod.duration}</span>
                    </div>
                  </div>

                  {/* Info Body */}
                  <div className="p-5 space-y-3">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-[#c85a32] block">
                        {prod.season}
                      </span>
                      <h3 className="font-editorial text-xl font-bold text-white group-hover:text-amber-400 transition-colors mt-0.5">
                        {prod.title}
                      </h3>
                      {prod.subTitle && (
                        <p className="text-xs text-[#9e968b] mt-0.5 italic">{prod.subTitle}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 py-3 border-y border-[#25221e] text-xs text-[#d8d0c5]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="line-clamp-1">{prod.dates}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#c85a32] shrink-0" />
                        <span className="line-clamp-1">{prod.venue}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#9e968b] line-clamp-2 leading-relaxed">
                      {prod.synopsis}
                    </p>

                    {/* Director's Note snippet if present */}
                    {prod.directorNote && (
                      <div className="p-2.5 rounded-xl bg-[#141210] border-l-2 border-amber-400/80 text-[11px] text-[#d8d0c5] italic">
                        <span className="line-clamp-2">"{prod.directorNote}"</span>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#787168] pt-1">
                      <span>
                        <strong className="text-white/80">Director:</strong> {prod.director}
                      </span>
                      <div className="flex items-center gap-3">
                        {prod.accolades && prod.accolades.length > 0 && (
                          <span className="text-amber-400 font-medium">{prod.accolades.length} Honors</span>
                        )}
                        {prod.cast && prod.cast.length > 0 && (
                          <span className="text-white/80">{prod.cast.length} Cast</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-4 bg-[#141210] border-t border-[#25221e] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#787168]">ID: {prod.id}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(prod)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#201e1b] hover:bg-amber-400 hover:text-black text-[#9e968b] text-xs font-semibold transition-colors"
                      title="Edit Production"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(prod.id)}
                      className="p-2 rounded-lg bg-[#201e1b] hover:bg-rose-950 hover:text-rose-400 text-[#787168] transition-colors"
                      title="Delete Production"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-16 bg-[#141210] border border-[#2b2723] rounded-2xl p-8">
              <Ticket className="w-8 h-8 text-amber-400/50 mx-auto mb-3" />
              <p className="text-white font-medium text-sm">No events match your search</p>
              <p className="text-xs text-[#787168] mt-1">Try adjusting the filter or add a new event above.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TOUR DATES & STOPS */}
      {activeTab === 'tour_dates' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141210] p-3 rounded-xl border border-[#2b2723]">
            <div className="flex items-center gap-2.5 flex-1 text-xs">
              <Search className="w-4 h-4 text-[#787168]" />
              <input
                type="text"
                placeholder="Search tour dates by city, country, hall, or production..."
                value={tourSearchTerm}
                onChange={(e) => setTourSearchTerm(e.target.value)}
                className="w-full bg-transparent text-white placeholder-[#787168] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTourDates.map((tour) => (
              <div
                key={tour.id}
                className="bg-[#181614] border border-[#2b2723] rounded-2xl p-5 flex flex-col justify-between group hover:border-amber-500/50 transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
                      {tour.city}, {tour.country}
                    </span>
                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md border ${
                        tour.status === 'Selling Fast'
                          ? 'border-amber-500/40 text-amber-400 bg-amber-950/30'
                          : tour.status === 'Few Passes Left'
                          ? 'border-rose-500/40 text-rose-400 bg-rose-950/30'
                          : 'border-emerald-500/40 text-emerald-400 bg-emerald-950/30'
                      }`}
                    >
                      {tour.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-editorial text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                      {tour.production}
                    </h4>
                    <p className="text-xs text-[#9e968b] flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#c85a32] shrink-0" />
                      <span>{tour.hall}</span>
                    </p>
                  </div>

                  <div className="py-2.5 border-y border-[#25221e] text-xs text-[#d8d0c5] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[#787168]">Dates:</span>
                      <span className="font-semibold text-white">{tour.dates}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#787168]">Showtime:</span>
                      <span>{tour.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#787168]">Pricing:</span>
                      <span className="text-amber-300">{tour.priceRange}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-[#25221e] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#787168]">{tour.availableTickets} Passes Buffer</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditTour(tour)}
                      className="p-1.5 rounded-lg bg-[#201e1b] hover:bg-amber-400 hover:text-black text-[#9e968b] transition-colors"
                      title="Edit Tour Stop"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTourConfirmId(tour.id)}
                      className="p-1.5 rounded-lg bg-[#201e1b] hover:bg-rose-950 hover:text-rose-400 text-[#787168] transition-colors"
                      title="Delete Tour Stop"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTourDates.length === 0 && (
            <div className="text-center py-16 bg-[#141210] border border-[#2b2723] rounded-2xl p-8">
              <Globe className="w-8 h-8 text-amber-400/50 mx-auto mb-3" />
              <p className="text-white font-medium text-sm">No tour stops match your search</p>
              <p className="text-xs text-[#787168] mt-1">Add a new tour stop using the button above.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: RESERVATION MODAL OPTIONS */}
      {activeTab === 'reservation_options' && (
        <div className="space-y-8">
          {saveSuccessMsg && (
            <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs flex items-center gap-3 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <strong>Reservation Options Saved!</strong> All choices for Performance Cities and Seating Tiers are immediately active on the live reservation modal.
              </div>
            </div>
          )}

          {/* Section 1: Performance Cities */}
          <div className="bg-[#181614] border border-[#2b2723] rounded-2xl p-6 sm:p-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#25221e]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block mb-1">
                  RESERVATION DROPDOWN 1 • CITIES
                </span>
                <h3 className="text-lg font-bold font-editorial text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>Performance Cities</span>
                </h3>
                <p className="text-xs text-[#9e968b] mt-0.5">
                  Controls the cities available in the "Performance City" dropdown of the pass reservation modal.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {resCities.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllCities}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#201e1b] hover:bg-rose-950/40 text-rose-400 border border-rose-500/20 text-xs transition-colors shrink-0"
                    title="Remove all cities"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleResetCities}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#201e1b] hover:bg-[#2b2824] text-[#9e968b] hover:text-white border border-[#332f2a] text-xs transition-colors shrink-0"
                  title="Reset to default cities"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset to Defaults</span>
                </button>
              </div>
            </div>

            {/* Add new city */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type new Performance City (e.g. Kolkata, Edinburgh, Paris)..."
                value={newCityInput}
                onChange={(e) => setNewCityInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCity();
                  }
                }}
                className="flex-1 bg-[#121110] border border-[#332f2a] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#787168] focus:border-amber-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddCity}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs tracking-wider uppercase transition-colors shrink-0"
              >
                + Add City
              </button>
            </div>

            {/* Cities List */}
            {resCities.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#141210] border border-dashed border-[#332f2a] text-center text-xs text-[#787168]">
                No cities configured. The reservation modal will show "No cities currently available".
              </div>
            ) : (
              <div className="space-y-2.5">
                {resCities.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#141210] border border-[#2b2723] group hover:border-[#3d3832] transition-colors"
                  >
                    <span className="w-6 h-6 rounded-full bg-[#201e1b] text-amber-400 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const updated = [...resCities];
                        updated[idx] = e.target.value;
                        setResCities(updated);
                        updateSiteSettings({ reservationCities: updated });
                      }}
                      className="flex-1 bg-transparent text-xs text-white focus:outline-none focus:bg-[#201e1b] px-2 py-1 rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveCity(idx)}
                      className="p-1.5 rounded-lg text-[#787168] hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                      title="Remove city"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Seating Tiers & Pricing */}
          <div className="bg-[#181614] border border-[#2b2723] rounded-2xl p-6 sm:p-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#25221e]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block mb-1">
                  RESERVATION DROPDOWN 2 • SEATING TIERS
                </span>
                <h3 className="text-lg font-bold font-editorial text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Seating Tiers & Pass Pricing</span>
                </h3>
                <p className="text-xs text-[#9e968b] mt-0.5">
                  Controls the pass categories and prices (INR) available in the reservation pass booking modal.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {resTiers.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllTiers}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#201e1b] hover:bg-rose-950/40 text-rose-400 border border-rose-500/20 text-xs transition-colors shrink-0"
                    title="Remove all tiers"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleResetTiers}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#201e1b] hover:bg-[#2b2824] text-[#9e968b] hover:text-white border border-[#332f2a] text-xs transition-colors shrink-0"
                  title="Reset to default tiers"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset to Defaults</span>
                </button>
              </div>
            </div>

            {/* Add new Tier */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <input
                type="text"
                placeholder="Tier name (e.g. Presidential Balcony, Guru Shishya Concession)..."
                value={newTierName}
                onChange={(e) => setNewTierName(e.target.value)}
                className="sm:col-span-8 bg-[#121110] border border-[#332f2a] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#787168] focus:border-amber-400 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Price (₹)"
                value={newTierPrice}
                onChange={(e) => setNewTierPrice(e.target.value ? Number(e.target.value) : '')}
                className="sm:col-span-2 bg-[#121110] border border-[#332f2a] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#787168] focus:border-amber-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddTier}
                className="sm:col-span-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs tracking-wider uppercase transition-colors shrink-0"
              >
                + Add Tier
              </button>
            </div>

            {/* Tiers List */}
            {resTiers.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#141210] border border-dashed border-[#332f2a] text-center text-xs text-[#787168]">
                No seating tiers configured. The reservation modal will show "No tiers configured".
              </div>
            ) : (
              <div className="space-y-2.5">
                {resTiers.map((tier, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#141210] border border-[#2b2723] group hover:border-[#3d3832] transition-colors"
                  >
                    <span className="w-6 h-6 rounded-full bg-[#201e1b] text-amber-400 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={tier.name}
                      onChange={(e) => {
                        const updated = [...resTiers];
                        updated[idx] = { ...updated[idx], name: e.target.value };
                        setResTiers(updated);
                        updateSiteSettings({ reservationTiers: updated });
                      }}
                      className="flex-1 bg-transparent text-xs text-white focus:outline-none focus:bg-[#201e1b] px-2 py-1 rounded"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#787168]">₹</span>
                      <input
                        type="number"
                        value={tier.price}
                        onChange={(e) => {
                          const updated = [...resTiers];
                          updated[idx] = { ...updated[idx], price: Number(e.target.value) || 0 };
                          setResTiers(updated);
                          updateSiteSettings({ reservationTiers: updated });
                        }}
                        className="w-24 bg-[#181614] border border-[#2b2723] rounded-lg px-2 py-1 text-xs text-amber-400 font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveTier(idx)}
                      className="p-1.5 rounded-lg text-[#787168] hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                      title="Remove tier"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* DELETE PRODUCTION CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181614] border border-rose-500/40 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-editorial text-lg font-bold text-white">Delete Production</h3>
            <p className="text-xs text-[#9e968b] leading-relaxed">
              Are you sure you want to remove this production? It will be deleted from the live events repertoire and season calendar.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs uppercase font-semibold text-[#9e968b] hover:text-white bg-[#221f1c]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduction(deleteConfirmId)}
                className="px-4 py-2 rounded-xl text-xs uppercase font-semibold text-white bg-rose-600 hover:bg-rose-500"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE TOUR STOP CONFIRMATION MODAL */}
      {deleteTourConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181614] border border-rose-500/40 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-editorial text-lg font-bold text-white">Delete Tour Stop</h3>
            <p className="text-xs text-[#9e968b] leading-relaxed">
              Are you sure you want to remove this tour stop? It will be deleted from the tour calendar and upcoming tour list.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteTourConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs uppercase font-semibold text-[#9e968b] hover:text-white bg-[#221f1c]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTourDate(deleteTourConfirmId)}
                className="px-4 py-2 rounded-xl text-xs uppercase font-semibold text-white bg-rose-600 hover:bg-rose-500"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT PRODUCTION MODAL */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <form
            onSubmit={handleSaveProduction}
            className="bg-[#181614] border border-[#332f2a] rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Modal Fixed Header */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-[#25221e] flex-shrink-0 bg-[#181614]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block">
                  {editingItem.id ? 'EDIT PRODUCTION' : 'CREATE NEW PRODUCTION'}
                </span>
                <h3 className="text-xl font-editorial font-bold text-white">
                  {editingItem.id ? editingItem.title : 'New Staged Repertoire Event'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg text-[#9e968b] hover:text-white hover:bg-[#201e1b] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {/* SECTION: TITLE & SUBTITLE */}
              <div className="space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block">
                  1. PRODUCTION IDENTITY & STAGING
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#9e968b] mb-1 font-semibold">Production Title *</label>
                    <input
                      type="text"
                      required
                      value={editingItem.title || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                      placeholder="e.g. THE CELESTIAL LOOM (VICHITRA)"
                      className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#9e968b] mb-1 font-semibold">Sub-title / Tagline</label>
                    <input
                      type="text"
                      value={editingItem.subTitle || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, subTitle: e.target.value })}
                      placeholder="e.g. An Epic Retelling through Chhau & Physical Theatre"
                      className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[#9e968b] mb-1 font-semibold">Touring Status</label>
                    <select
                      value={editingItem.status || 'Upcoming Premiere'}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          status: e.target.value as Production['status'],
                        })
                      }
                      className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                    >
                      <option value="Now Touring">Now Touring</option>
                      <option value="Upcoming Premiere">Upcoming Premiere</option>
                      <option value="In Rehearsal">In Rehearsal</option>
                      <option value="Archival Vault">Archival Vault</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#9e968b] mb-1 font-semibold">Genre</label>
                    <input
                      type="text"
                      value={editingItem.genre || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, genre: e.target.value })}
                      placeholder="e.g. Physical Dance-Theatre"
                      className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#9e968b] mb-1 font-semibold">Season</label>
                    <input
                      type="text"
                      value={editingItem.season || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, season: e.target.value })}
                      placeholder="e.g. 2026-2027 World Tour"
                      className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[#9e968b] mb-1 font-semibold">Dates *</label>
                    <input
                      type="text"
                      required
                      value={editingItem.dates || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, dates: e.target.value })}
                      placeholder="e.g. October 12 – 28, 2026"
                      className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#9e968b] mb-1 font-semibold">Duration *</label>
                    <input
                      type="text"
                      value={editingItem.duration || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, duration: e.target.value })}
                      placeholder="e.g. 110 minutes (with interval)"
                      className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#9e968b] mb-1 font-semibold">Ticket Price Range</label>
                    <input
                      type="text"
                      value={editingItem.ticketPrice || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, ticketPrice: e.target.value })}
                      placeholder="e.g. ₹750 – ₹3,200 / £25 – £65"
                      className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#9e968b] mb-1 font-semibold">Premiere Venue / Halls *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.venue || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, venue: e.target.value })}
                    placeholder="e.g. Kamani Auditorium, New Delhi & Barbican Center, London"
                    className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* SECTION: CREATIVE DIRECTORS & BANNER */}
              <div className="space-y-4 pt-4 border-t border-[#25221e]">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block">
                  2. CREATIVE TEAM & MEDIA
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#9e968b] mb-1 font-semibold">Director</label>
                    <input
                      type="text"
                      value={editingItem.director || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, director: e.target.value })}
                      placeholder="e.g. Anuradha Sen"
                      className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#9e968b] mb-1 font-semibold">Playwright / Text</label>
                    <input
                      type="text"
                      value={editingItem.playwright || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, playwright: e.target.value })}
                      placeholder="e.g. Dr. Siddharth Narayan"
                      className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* MEDIA UPLOAD FIELD FOR PRODUCTION BANNER */}
                <div className="pt-2">
                  <MediaUploadField
                    label="Production Banner Photograph *"
                    value={editingItem.bannerImage || ''}
                    onChange={(url) => setEditingItem({ ...editingItem, bannerImage: url })}
                    category="Performances"
                    aspectRatio="16:9"
                    helperText="Upload event poster or stage action photograph from device or media vault"
                  />
                </div>
              </div>

              {/* SECTION: SYNOPSIS & DIRECTOR'S NOTE */}
              <div className="space-y-4 pt-4 border-t border-[#25221e]">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block">
                  3. SYNOPSIS & ARTISTIC VISION
                </span>

                <div>
                  <label className="block text-[#9e968b] mb-1 font-semibold">Dramaturgical Synopsis</label>
                  <textarea
                    rows={3}
                    value={editingItem.synopsis || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, synopsis: e.target.value })}
                    placeholder="Vichitra reimagines the dice game and cosmic battlefield of Kurukshetra not as a conflict of men, but as an ancient cosmic loom..."
                    className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[#9e968b] mb-1 font-semibold flex items-center gap-1.5">
                    <Quote className="w-3.5 h-3.5 text-amber-400" />
                    <span>Director's Note (Artistic Vision Quote)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={editingItem.directorNote || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, directorNote: e.target.value })}
                    placeholder="e.g. We stripped away the decorative romance often draped over the epic to expose its raw, bone-white moral tragedy. Every sword stroke is a metronome counting down the end of an era."
                    className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none leading-relaxed italic"
                  />
                  <p className="text-[11px] text-[#787168] mt-1">
                    Displayed prominently under "Director's Note" on the production details page with quote attribution to the Director.
                  </p>
                </div>
              </div>

              {/* SECTION: HONORS & ACCOLADES */}
              <div className="space-y-3 pt-4 border-t border-[#25221e]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>4. CRITICAL ACCLAIM & ACCOLADES ({modalAccolades.length})</span>
                  </span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Winner: National Sangeet Natak Akademi Production of the Year..."
                    value={newAccoladeInput}
                    onChange={(e) => setNewAccoladeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddAccolade();
                      }
                    }}
                    className="flex-1 bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2 text-white placeholder-[#787168] focus:border-amber-400 focus:outline-none text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddAccolade}
                    className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs transition-colors shrink-0"
                  >
                    + Add Accolade
                  </button>
                </div>

                {modalAccolades.length > 0 && (
                  <div className="space-y-2">
                    {modalAccolades.map((acc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-[#121110] border border-[#2b2723]"
                      >
                        <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <input
                          type="text"
                          value={acc}
                          onChange={(e) => handleEditAccolade(idx, e.target.value)}
                          className="flex-1 bg-transparent text-xs text-white focus:outline-none focus:bg-[#1a1816] px-1.5 py-0.5 rounded"
                        />
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveAccolade(idx, 'up')}
                          className={`p-1 text-[#787168] hover:text-white ${idx === 0 ? 'opacity-30' : ''}`}
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === modalAccolades.length - 1}
                          onClick={() => handleMoveAccolade(idx, 'down')}
                          className={`p-1 text-[#787168] hover:text-white ${idx === modalAccolades.length - 1 ? 'opacity-30' : ''}`}
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveAccolade(idx)}
                          className="p-1 text-[#787168] hover:text-rose-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION: DRAMATIS PERSONAE & CAST */}
              <div className="space-y-3 pt-4 border-t border-[#25221e]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>5. DRAMATIS PERSONAE & CAST ({modalCast.length})</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowBulkCast(!showBulkCast)}
                    className="text-[11px] text-amber-400 hover:underline"
                  >
                    {showBulkCast ? 'Use List View' : 'Paste Raw List'}
                  </button>
                </div>

                {showBulkCast ? (
                  <div className="space-y-2">
                    <textarea
                      rows={5}
                      value={bulkCastInput}
                      onChange={(e) => setBulkCastInput(e.target.value)}
                      placeholder="Karna: Devrat Joshi&#10;Draupadi: Vani Pillai&#10;Yudhishthira: Tushar Mukherjee&#10;The Sutradhar (Time): Sutradhar Ramdas Bhatt"
                      className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white font-mono text-[11px] focus:outline-none focus:border-amber-400 leading-relaxed"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={handleImportBulkCast}
                        className="px-3 py-1.5 rounded-lg bg-amber-400 text-black font-semibold text-xs"
                      >
                        Apply Parsed Cast
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                      <input
                        type="text"
                        placeholder="Character Role (e.g. Karna)"
                        value={newCastRole}
                        onChange={(e) => setNewCastRole(e.target.value)}
                        className="sm:col-span-5 bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2 text-white placeholder-[#787168] focus:border-amber-400 focus:outline-none text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Actor Name (e.g. Devrat Joshi)"
                        value={newCastActor}
                        onChange={(e) => setNewCastActor(e.target.value)}
                        className="sm:col-span-5 bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2 text-white placeholder-[#787168] focus:border-amber-400 focus:outline-none text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddCastMember}
                        className="sm:col-span-2 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs transition-colors"
                      >
                        + Add Cast
                      </button>
                    </div>

                    {modalCast.length > 0 && (
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {modalCast.map((c, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 p-2 rounded-xl bg-[#121110] border border-[#2b2723]"
                          >
                            <input
                              type="text"
                              value={c.role}
                              onChange={(e) => handleEditCastMember(idx, e.target.value, c.actor)}
                              placeholder="Role"
                              className="w-1/2 bg-transparent text-xs text-white font-medium focus:outline-none focus:bg-[#1a1816] px-1.5 py-0.5 rounded"
                            />
                            <span className="text-[#787168]">:</span>
                            <input
                              type="text"
                              value={c.actor}
                              onChange={(e) => handleEditCastMember(idx, c.role, e.target.value)}
                              placeholder="Actor"
                              className="w-1/2 bg-transparent text-xs text-[#d8d0c5] focus:outline-none focus:bg-[#1a1816] px-1.5 py-0.5 rounded"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveCastMember(idx)}
                              className="p-1 text-[#787168] hover:text-rose-400 shrink-0"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Modal Fixed Footer */}
            <div className="flex items-center justify-end gap-3 p-4 sm:px-6 border-t border-[#25221e] flex-shrink-0 bg-[#181614]">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs uppercase font-semibold text-[#9e968b] hover:text-white bg-[#201e1b] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs uppercase font-semibold text-black bg-amber-400 hover:bg-amber-300 shadow-md shadow-amber-400/20 transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Save Production</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ADD / EDIT TOUR STOP MODAL */}
      {isTourModalOpen && editingTourDate && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <form
            onSubmit={handleSaveTourDate}
            className="bg-[#181614] border border-[#332f2a] rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between p-6 pb-4 border-b border-[#25221e] flex-shrink-0 bg-[#181614]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block">
                  {editingTourDate.id ? 'EDIT TOUR STOP' : 'ADD NEW TOUR STOP'}
                </span>
                <h3 className="text-xl font-editorial font-bold text-white">
                  {editingTourDate.city ? `${editingTourDate.city} Tour Date` : 'New World Tour Stop'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTourModalOpen(false)}
                className="p-2 rounded-lg text-[#9e968b] hover:text-white hover:bg-[#201e1b] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[#9e968b] mb-1 font-semibold">Associated Production *</label>
                <select
                  value={editingTourDate.production || ''}
                  onChange={(e) => setEditingTourDate({ ...editingTourDate, production: e.target.value })}
                  className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                >
                  {events.map((p) => (
                    <option key={p.id} value={p.title}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#9e968b] mb-1 font-semibold">City *</label>
                  <input
                    type="text"
                    required
                    value={editingTourDate.city || ''}
                    onChange={(e) => setEditingTourDate({ ...editingTourDate, city: e.target.value })}
                    placeholder="e.g. New Delhi"
                    className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#9e968b] mb-1 font-semibold">Country</label>
                  <input
                    type="text"
                    value={editingTourDate.country || ''}
                    onChange={(e) => setEditingTourDate({ ...editingTourDate, country: e.target.value })}
                    placeholder="e.g. India"
                    className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#9e968b] mb-1 font-semibold">Hall / Theatre Venue *</label>
                <input
                  type="text"
                  required
                  value={editingTourDate.hall || ''}
                  onChange={(e) => setEditingTourDate({ ...editingTourDate, hall: e.target.value })}
                  placeholder="e.g. Kamani Auditorium, Mandi House"
                  className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#9e968b] mb-1 font-semibold">Tour Dates *</label>
                  <input
                    type="text"
                    required
                    value={editingTourDate.dates || ''}
                    onChange={(e) => setEditingTourDate({ ...editingTourDate, dates: e.target.value })}
                    placeholder="e.g. October 12 – 18, 2026"
                    className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#9e968b] mb-1 font-semibold">Showtime *</label>
                  <input
                    type="text"
                    value={editingTourDate.time || ''}
                    onChange={(e) => setEditingTourDate({ ...editingTourDate, time: e.target.value })}
                    placeholder="e.g. 19:00 IST"
                    className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#9e968b] mb-1 font-semibold">Pricing</label>
                  <input
                    type="text"
                    value={editingTourDate.priceRange || ''}
                    onChange={(e) => setEditingTourDate({ ...editingTourDate, priceRange: e.target.value })}
                    placeholder="e.g. ₹800 – ₹3,000"
                    className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#9e968b] mb-1 font-semibold">Passes Buffer</label>
                  <input
                    type="number"
                    value={editingTourDate.availableTickets ?? 40}
                    onChange={(e) => setEditingTourDate({ ...editingTourDate, availableTickets: Number(e.target.value) })}
                    className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#9e968b] mb-1 font-semibold">Status</label>
                  <select
                    value={editingTourDate.status || 'Selling Fast'}
                    onChange={(e) => setEditingTourDate({ ...editingTourDate, status: e.target.value as TourDate['status'] })}
                    className="w-full bg-[#121110] border border-[#332f2a] rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Selling Fast">Selling Fast</option>
                    <option value="Few Passes Left">Few Passes Left</option>
                    <option value="Opening Soon">Opening Soon</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-4 sm:px-6 border-t border-[#25221e] flex-shrink-0 bg-[#181614]">
              <button
                type="button"
                onClick={() => setIsTourModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs uppercase font-semibold text-[#9e968b] hover:text-white bg-[#201e1b] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs uppercase font-semibold text-black bg-amber-400 hover:bg-amber-300 shadow-md shadow-amber-400/20 transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Save Tour Stop</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
