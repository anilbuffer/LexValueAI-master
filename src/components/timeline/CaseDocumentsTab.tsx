"use client"
import { useState, useMemo } from "react"
import { 
  Folder, 
  Plus, 
  UploadCloud, 
  LayoutGrid, 
  List, 
  MoreVertical, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  Image as ImageIcon, 
  SlidersHorizontal, 
  Search, 
  Eye, 
  Download, 
  X,
  FileSearch,
  CheckCircle2
} from "lucide-react"
import toast from "react-hot-toast"

type CategoryType = 'all' | 'medical' | 'police' | 'insurance' | 'property_damage' | 'other'
type ViewMode = 'grid' | 'list'

interface DocItem {
  id: string
  title: string
  category: CategoryType
  categoryLabel: string
  date: string
  size?: string
  pages?: number
  type: 'photo' | 'pdf' | 'doc'
  thumbnail?: string
  aiProcessed?: boolean
  description?: string
}

export function CaseDocumentsTab({ caseData }: { caseData?: any }) {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('property_damage')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [activePhotoModal, setActivePhotoModal] = useState<DocItem | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadType, setUploadType] = useState<'document' | 'photo'>('photo')

  // Sample photos & documents dataset matching reference image
  const mockDocumentsList: DocItem[] = useMemo(() => [
    // Property Damage Photos (15 items)
    {
      id: "pd-1",
      title: "front-bumper-damag...",
      category: "property_damage",
      categoryLabel: "Property Damage Photos",
      date: "Aug 12, 2026",
      type: "photo",
      thumbnail: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80",
      description: "Front bumper impact & headlight housing damage."
    },
    {
      id: "pd-2",
      title: "front-grille-impact.jpg",
      category: "property_damage",
      categoryLabel: "Property Damage Photos",
      date: "Aug 12, 2026",
      type: "photo",
      thumbnail: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&auto=format&fit=crop&q=80",
      description: "Radiator grille structural crush zone."
    },
    {
      id: "pd-3",
      title: "front-left-damage.jpg",
      category: "property_damage",
      categoryLabel: "Property Damage Photos",
      date: "Aug 12, 2026",
      type: "photo",
      thumbnail: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=80",
      description: "Driver side quarter panel dent and paint transfer."
    },
    {
      id: "pd-4",
      title: "rear-bumper.jpg",
      category: "property_damage",
      categoryLabel: "Property Damage Photos",
      date: "Aug 12, 2026",
      type: "photo",
      thumbnail: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80",
      description: "Rear bumper impact collapse & trunk pan crease."
    },
    {
      id: "pd-5",
      title: "driver-side-damage.jpg",
      category: "property_damage",
      categoryLabel: "Property Damage Photos",
      date: "Aug 12, 2026",
      type: "photo",
      thumbnail: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&auto=format&fit=crop&q=80",
      description: "Driver door structural deformation."
    },
    {
      id: "pd-6",
      title: "headlight-shatter.jpg",
      category: "property_damage",
      categoryLabel: "Property Damage Photos",
      date: "Aug 12, 2026",
      type: "photo",
      thumbnail: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&auto=format&fit=crop&q=80",
      description: "Left LED assembly shattered."
    },
    {
      id: "pd-7",
      title: "windshield-crack.jpg",
      category: "property_damage",
      categoryLabel: "Property Damage Photos",
      date: "Aug 12, 2026",
      type: "photo",
      thumbnail: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600&auto=format&fit=crop&q=80",
      description: "Laminated glass spiderweb stress fracture."
    },
    {
      id: "pd-8",
      title: "side-mirror-impact.jpg",
      category: "property_damage",
      categoryLabel: "Property Damage Photos",
      date: "Aug 12, 2026",
      type: "photo",
      thumbnail: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&auto=format&fit=crop&q=80",
      description: "Passenger mirror sheared off."
    },
    {
      id: "pd-9",
      title: "trunk-pan-bend.jpg",
      category: "property_damage",
      categoryLabel: "Property Damage Photos",
      date: "Aug 12, 2026",
      type: "photo",
      thumbnail: "https://images.unsplash.com/photo-1541348263662-e082662d82da?w=600&auto=format&fit=crop&q=80",
      description: "Trunk floor pan structural buckle."
    },
    {
      id: "pd-10",
      title: "frame-alignment-chk.jpg",
      category: "property_damage",
      categoryLabel: "Property Damage Photos",
      date: "Aug 12, 2026",
      type: "photo",
      thumbnail: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=600&auto=format&fit=crop&q=80",
      description: "Laser frame measurement report."
    },
    {
      id: "pd-11",
      title: "underbody-scrape.jpg",
      category: "property_damage",
      categoryLabel: "Property Damage Photos",
      date: "Aug 12, 2026",
      type: "photo",
      thumbnail: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80",
      description: "Exhaust system & subframe scrape."
    },
    {
      id: "pd-12",
      title: "paint-transfer-rear.jpg",
      category: "property_damage",
      categoryLabel: "Property Damage Photos",
      date: "Aug 12, 2026",
      type: "photo",
      thumbnail: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&auto=format&fit=crop&q=80",
      description: "White paint transfer from defendant's truck bumper."
    },
    {
      id: "pd-13",
      title: "tail-light-broken.jpg",
      category: "property_damage",
      categoryLabel: "Property Damage Photos",
      date: "Aug 12, 2026",
      type: "photo",
      thumbnail: "https://images.unsplash.com/photo-1508974239320-0a029497e820?w=600&auto=format&fit=crop&q=80",
      description: "Right rear taillight housing shattered."
    },
    {
      id: "pd-14",
      title: "hood-crease.jpg",
      category: "property_damage",
      categoryLabel: "Property Damage Photos",
      date: "Aug 12, 2026",
      type: "photo",
      thumbnail: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&auto=format&fit=crop&q=80",
      description: "Engine hood crumple fold."
    },
    {
      id: "pd-15",
      title: "wheel-well-dent.jpg",
      category: "property_damage",
      categoryLabel: "Property Damage Photos",
      date: "Aug 12, 2026",
      type: "photo",
      thumbnail: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=600&auto=format&fit=crop&q=80",
      description: "Front left wheel arch contact fold."
    },

    // Medical Records (PDFs)
    {
      id: "med-1",
      title: "City General Hospital - ER Admission Chart.pdf",
      category: "medical",
      categoryLabel: "Medical Records",
      date: "Aug 10, 2026",
      size: "4.2 MB",
      pages: 18,
      type: "pdf",
      aiProcessed: true,
      description: "Emergency room physical intake, neck CT scan results, acute cervical strain diagnosis."
    },
    {
      id: "med-2",
      title: "Apex Orthopedics - Spine Evaluation.pdf",
      category: "medical",
      categoryLabel: "Medical Records",
      date: "Aug 15, 2026",
      size: "6.1 MB",
      pages: 24,
      type: "pdf",
      aiProcessed: true,
      description: "Orthopedic consultation report diagnosing C5-C6 disc herniation."
    },
    {
      id: "med-3",
      title: "Open MRI Radiography Addendum.pdf",
      category: "medical",
      categoryLabel: "Medical Records",
      date: "Aug 18, 2026",
      size: "12.8 MB",
      pages: 8,
      type: "pdf",
      aiProcessed: true,
      description: "High-field MRI lumbar & cervical spine multi-planar scan findings."
    },
    {
      id: "med-4",
      title: "Summit Physical Therapy Notes (Sessions 1-12).pdf",
      category: "medical",
      categoryLabel: "Medical Records",
      date: "Aug 22, 2026",
      size: "8.5 MB",
      pages: 36,
      type: "pdf",
      aiProcessed: true,
      description: "Ongoing physical rehab compliance, ROM progress charts, pain index scale."
    },

    // Police / Accident Reports
    {
      id: "pol-1",
      title: "State Police Traffic Crash Report #24-118342.pdf",
      category: "police",
      categoryLabel: "Accident / Police Reports",
      date: "Aug 08, 2026",
      size: "2.1 MB",
      pages: 6,
      type: "pdf",
      aiProcessed: true,
      description: "Official crash report establishing defendant fault, speed estimation, citation details."
    },
    {
      id: "pol-2",
      title: "911 Audio Transcript & Dispatch Incident Log.pdf",
      category: "police",
      categoryLabel: "Accident / Police Reports",
      date: "Aug 08, 2026",
      size: "1.4 MB",
      pages: 4,
      type: "pdf",
      aiProcessed: true,
      description: "911 call timestamped record and emergency ambulance dispatch priority record."
    },

    // Insurance Documents
    {
      id: "ins-1",
      title: "State Farm Policy Declarations & Limits.pdf",
      category: "insurance",
      categoryLabel: "Insurance Documents",
      date: "Aug 11, 2026",
      size: "1.8 MB",
      pages: 5,
      type: "pdf",
      aiProcessed: true,
      description: "Bodily injury liability coverage limits ($100k/$300k) & UM/UIM policy endorsement."
    },
    {
      id: "ins-2",
      title: "Geico Initial Claim Acknowledgment & Coverage Letter.pdf",
      category: "insurance",
      categoryLabel: "Insurance Documents",
      date: "Aug 14, 2026",
      size: "1.1 MB",
      pages: 3,
      type: "pdf",
      aiProcessed: true,
      description: "Adverse insurer claim confirmation letter and assigned adjuster contact info."
    },

    // Other Documents
    {
      id: "oth-1",
      title: "Lost Wages Employer Statement - Q2 Verification.pdf",
      category: "other",
      categoryLabel: "Other Documents",
      date: "Aug 20, 2026",
      size: "950 KB",
      pages: 3,
      type: "pdf",
      aiProcessed: true,
      description: "HR paystub record confirming 3 weeks of uncompensated missed work."
    }
  ], [])

  // Filter items by active category and search query
  const filteredItems = useMemo(() => {
    return mockDocumentsList.filter(item => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory
      const matchesSearch = !searchQuery || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesCategory && matchesSearch
    })
  }, [mockDocumentsList, activeCategory, searchQuery])

  // Category counts matching the reference image numbers
  const counts = useMemo(() => {
    return {
      all: 128,
      medical: 84,
      police: 6,
      insurance: 12,
      property_damage: 15,
      other: 11
    }
  }, [])

  // Pagination slice (showing 5 per page for photo grid like reference image)
  const itemsPerPage = activeCategory === 'property_damage' && viewMode === 'grid' ? 5 : 8
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1
  const displayedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleUploadClick = (type: 'document' | 'photo') => {
    setUploadType(type)
    setShowUploadModal(true)
  }

  const handleSimulateUpload = () => {
    toast.success(`Successfully uploaded new ${uploadType === 'photo' ? 'Property Photo' : 'Case Document'}!`)
    setShowUploadModal(false)
  }

  return (
    <div className="flex flex-col w-full bg-white min-h-[600px] text-slate-800 font-sans">
      
      {/* 1. TOP HEADER SECTION */}
      <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 shadow-xs">
              <Folder className="w-5 h-5 fill-teal-700/10" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Case Documents</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
            All documents and photos uploaded for this case. AI uses these to generate insights and strengthen your case.
          </p>
        </div>

        {/* Right Action Buttons with Brand Teal Colors */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button 
            onClick={() => handleUploadClick('document')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 text-xs font-semibold rounded-lg shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-500" />
            Upload Documents
          </button>

          <button 
            onClick={() => handleUploadClick('photo')}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-900 hover:bg-teal-950 text-white text-xs font-semibold rounded-lg shadow-xs shadow-teal-900/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add More Photos
          </button>

          <button 
            onClick={() => toast("Filtering options...")}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Filter options"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. SUB NAVIGATION (CATEGORY TABS & VIEW TOGGLE WITH BRAND TEAL HIGHLIGHTS) */}
      <div className="px-5 pt-3 pb-0 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/40">
        
        {/* Category Sub-Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          
          <button
            onClick={() => { setActiveCategory('all'); setCurrentPage(1); }}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-semibold transition-all whitespace-nowrap border-b-2 cursor-pointer ${
              activeCategory === 'all'
                ? 'border-teal-700 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            All Documents
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium transition-colors ${
              activeCategory === 'all' ? 'bg-teal-50 text-teal-800 border border-teal-200' : 'bg-slate-100 text-slate-500'
            }`}>
              {counts.all}
            </span>
          </button>

          <button
            onClick={() => { setActiveCategory('medical'); setCurrentPage(1); }}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-semibold transition-all whitespace-nowrap border-b-2 cursor-pointer ${
              activeCategory === 'medical'
                ? 'border-teal-700 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Medical Records
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium transition-colors ${
              activeCategory === 'medical' ? 'bg-teal-50 text-teal-800 border border-teal-200' : 'bg-slate-100 text-slate-500'
            }`}>
              {counts.medical}
            </span>
          </button>

          <button
            onClick={() => { setActiveCategory('police'); setCurrentPage(1); }}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-semibold transition-all whitespace-nowrap border-b-2 cursor-pointer ${
              activeCategory === 'police'
                ? 'border-teal-700 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Accident / Police Reports
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium transition-colors ${
              activeCategory === 'police' ? 'bg-teal-50 text-teal-800 border border-teal-200' : 'bg-slate-100 text-slate-500'
            }`}>
              {counts.police}
            </span>
          </button>

          <button
            onClick={() => { setActiveCategory('insurance'); setCurrentPage(1); }}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-semibold transition-all whitespace-nowrap border-b-2 cursor-pointer ${
              activeCategory === 'insurance'
                ? 'border-teal-700 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Insurance Documents
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium transition-colors ${
              activeCategory === 'insurance' ? 'bg-teal-50 text-teal-800 border border-teal-200' : 'bg-slate-100 text-slate-500'
            }`}>
              {counts.insurance}
            </span>
          </button>

          <button
            onClick={() => { setActiveCategory('property_damage'); setCurrentPage(1); }}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-semibold transition-all whitespace-nowrap border-b-2 cursor-pointer ${
              activeCategory === 'property_damage'
                ? 'border-teal-700 text-teal-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Property Damage Photos
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium transition-colors ${
              activeCategory === 'property_damage' ? 'bg-teal-50 text-teal-800 border border-teal-200' : 'bg-slate-100 text-slate-500'
            }`}>
              {counts.property_damage}
            </span>
          </button>

          <button
            onClick={() => { setActiveCategory('other'); setCurrentPage(1); }}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-semibold transition-all whitespace-nowrap border-b-2 cursor-pointer ${
              activeCategory === 'other'
                ? 'border-teal-700 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Other Documents
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium transition-colors ${
              activeCategory === 'other' ? 'bg-teal-50 text-teal-800 border border-teal-200' : 'bg-slate-100 text-slate-500'
            }`}>
              {counts.other}
            </span>
          </button>

        </div>

        {/* View Mode Switchers */}
        <div className="flex items-center gap-1 pb-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md border transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white text-slate-800 border-slate-200 shadow-xs'
                : 'bg-transparent text-slate-400 border-transparent hover:text-slate-600'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md border transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-white text-slate-800 border-slate-200 shadow-xs'
                : 'bg-transparent text-slate-400 border-transparent hover:text-slate-600'
            }`}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* SEARCH BAR FOR QUICK FILTERING */}
      <div className="px-5 pt-3 pb-1 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Search ${activeCategory === 'property_damage' ? 'photos' : 'documents'}...`}
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600 focus:bg-white transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 3. MAIN CONTENT AREA */}
      <div className="p-5 flex-1">

        {displayedItems.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <FileSearch className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-700">No documents found</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              No files match your current category or search criteria.
            </p>
          </div>
        ) : (
          <>
            {/* GRID VIEW */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {displayedItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex flex-col group cursor-pointer"
                    onClick={() => item.type === 'photo' ? setActivePhotoModal(item) : toast(`Viewing document: ${item.title}`)}
                  >
                    {/* Thumbnail Card */}
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-xs relative group-hover:shadow-md group-hover:border-teal-400 transition-all">
                      {item.type === 'photo' && item.thumbnail ? (
                        <img 
                          src={item.thumbnail} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400 p-4">
                          <FileText className="w-10 h-10 text-teal-700/70 mb-1" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.size || 'PDF'}</span>
                        </div>
                      )}
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-[11px] font-semibold text-white bg-slate-900/70 px-2.5 py-1 rounded-md flex items-center gap-1 backdrop-blur-sm">
                          <Eye className="w-3.5 h-3.5" /> Preview
                        </span>
                      </div>
                    </div>

                    {/* Title & Metadata below card */}
                    <div className="mt-2 flex flex-col">
                      <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-teal-800 transition-colors" title={item.title}>
                        {item.title}
                      </h4>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[11px] font-medium text-slate-400">
                          {item.date}
                        </span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toast(`Options for ${item.title}`);
                          }} 
                          className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

            {/* LIST VIEW */}
            {viewMode === 'list' && (
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Document / File Name</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Upload Date</th>
                      <th className="py-3 px-4">Size & Pages</th>
                      <th className="py-3 px-4">AI Processing</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {displayedItems.map((item) => (
                      <tr key={item.id} className="hover:bg-teal-50/40 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          <div className="flex items-center gap-2.5">
                            {item.type === 'photo' ? (
                              <ImageIcon className="w-4 h-4 text-teal-600 shrink-0" />
                            ) : (
                              <FileText className="w-4 h-4 text-teal-800 shrink-0" />
                            )}
                            <span className="truncate max-w-xs">{item.title}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-medium text-[11px]">
                            {item.categoryLabel}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500">{item.date}</td>
                        <td className="py-3 px-4 text-slate-500">
                          {item.size ? `${item.size} • ${item.pages} pgs` : 'Photo'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 w-fit">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Extracted & Indexed
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button 
                              onClick={() => item.type === 'photo' ? setActivePhotoModal(item) : toast(`Opening ${item.title}`)}
                              className="p-1.5 text-slate-400 hover:text-teal-800 hover:bg-teal-50 rounded-md transition-colors"
                              title="View file"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => toast.success(`Downloading ${item.title}`)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

      </div>

      {/* 4. FOOTER & PAGINATION (WITH BRAND TEAL COLORS) */}
      <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 bg-slate-50/30">
        <div>
          Showing <span className="font-semibold text-slate-800">
            {filteredItems.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}–{Math.min(currentPage * itemsPerPage, counts[activeCategory] || filteredItems.length)}
          </span> of <span className="font-semibold text-slate-800">
            {counts[activeCategory] || filteredItems.length}
          </span> {activeCategory === 'property_damage' ? 'photos' : 'documents'}
        </div>

        {/* Pagination Buttons (< 1 2 3 >) */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {[1, 2, 3].map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                currentPage === page
                  ? 'bg-teal-50 text-teal-800 border border-teal-200 font-bold shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 1}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* LIGHTBOX PHOTO MODAL */}
      {activePhotoModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-teal-700" />
                <h3 className="text-sm font-bold text-slate-800">{activePhotoModal.title}</h3>
              </div>
              <button 
                onClick={() => setActivePhotoModal(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 bg-slate-950 flex items-center justify-center max-h-[60vh]">
              <img 
                src={activePhotoModal.thumbnail} 
                alt={activePhotoModal.title} 
                className="max-h-[55vh] object-contain rounded-lg shadow-lg"
              />
            </div>

            <div className="p-4 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-slate-800">{activePhotoModal.description}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Uploaded {activePhotoModal.date} • High Resolution Inspection Image</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => { toast.success("Downloading high resolution photo..."); setActivePhotoModal(null); }}
                  className="px-3 py-1.5 bg-teal-900 text-white font-medium text-xs rounded-lg hover:bg-teal-950 transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" /> Download Full Res
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-teal-700" />
                <h3 className="text-base font-bold text-slate-900">
                  {uploadType === 'photo' ? 'Upload Property Damage Photos' : 'Upload Case Documents'}
                </h3>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div 
              onClick={handleSimulateUpload}
              className="border-2 border-dashed border-teal-200 hover:border-teal-600 bg-teal-50/40 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-teal-50/70"
            >
              <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center mb-3 shadow-inner">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-800">Click to browse or drop files here</p>
              <p className="text-xs text-slate-500 mt-1">
                Supports JPG, PNG, PDF, DOCX (Up to 50MB per file). Encrypted & HIPAA Compliant.
              </p>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button 
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSimulateUpload}
                className="px-4 py-2 bg-teal-900 text-white font-semibold text-xs rounded-lg hover:bg-teal-950 transition-colors shadow-xs"
              >
                Upload File
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
