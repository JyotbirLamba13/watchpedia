'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

type Tab = 'watches' | 'brands' | 'groups' | 'blog' | 'corrections';

interface Watch {
  id?: number;
  slug: string;
  name: string;
  brand_slug: string;
  collection: string;
  reference: string;
  image: string;
  featured: boolean;
  description: string;
  case_diameter: string;
  case_material: string;
  case_thickness: string;
  movement: string;
  movement_type: string;
  crystal: string;
  dial_color: string;
  water_resistance: string;
  power_reserve: string;
  price: string;
  year_introduced: number | null;
  image_source: string;
}

interface Correction {
  id: number;
  brand_slug: string;
  watch_reference: string;
  watch_name: string;
  field_name: string;
  current_value: string | null;
  correct_value: string;
  reporter_note: string | null;
  status: string;
  created_at: string;
}

interface Brand {
  slug: string;
  name: string;
  country: string;
  founded: number;
  description: string;
  website: string;
  group_slug: string | null;
  logo_url: string | null;
}

const emptyWatch: Watch = {
  slug: '', name: '', brand_slug: '', collection: '', reference: '', image: '',
  featured: false, description: '', case_diameter: '', case_material: '',
  case_thickness: '', movement: '', movement_type: 'Automatic', crystal: 'Sapphire',
  dial_color: '', water_resistance: '', power_reserve: '', price: '', year_introduced: null,
  image_source: '',
};

const emptyBrand: Brand = {
  slug: '', name: '', country: 'switzerland', founded: 2000,
  description: '', website: '', group_slug: null, logo_url: null,
};

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('watches');
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [watches, setWatches] = useState<Watch[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [editing, setEditing] = useState<Watch | null>(null);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const loadData = useCallback(async () => {
    const client = getSupabaseClient();
    if (!client) return showMessage('Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
    setLoading(true);
    const [{ data: w }, { data: b }, { data: c }] = await Promise.all([
      client.from('watches').select('*').order('brand_slug').order('name'),
      client.from('brands').select('*').order('name'),
      client.from('watch_corrections').select('*').order('created_at', { ascending: false }),
    ]);
    if (w) setWatches(w);
    if (b) setBrands(b);
    if (c) setCorrections(c);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authed) loadData();
  }, [authed, loadData]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'watchpedia2026') {
      setAuthed(true);
    } else {
      showMessage('Wrong password');
    }
  };

  const saveWatch = async (watch: Watch) => {
    const client = getSupabaseClient();
    if (!client) return;
    const { id, ...data } = watch;
    if (id) {
      const { error } = await client.from('watches').update(data).eq('id', id);
      if (error) return showMessage('Error: ' + error.message);
    } else {
      const { error } = await client.from('watches').insert(data);
      if (error) return showMessage('Error: ' + error.message);
    }
    showMessage('Watch saved!');
    setEditing(null);
    loadData();
  };

  const deleteWatch = async (id: number) => {
    const client = getSupabaseClient();
    if (!client || !confirm('Delete this watch?')) return;
    await client.from('watches').delete().eq('id', id);
    showMessage('Watch deleted');
    loadData();
  };

  const saveBrand = async (brand: Brand) => {
    const client = getSupabaseClient();
    if (!client) return;
    const { error } = await client.from('brands').upsert(brand, { onConflict: 'slug' });
    if (error) return showMessage('Error: ' + error.message);
    showMessage('Brand saved!');
    setEditingBrand(null);
    loadData();
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg w-80">
          <h1 className="text-xl font-bold mb-4 text-center">Watchpedia Admin</h1>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button type="submit" className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800">
            Login
          </button>
          {message && <p className="text-red-500 text-sm mt-2 text-center">{message}</p>}
        </form>
      </div>
    );
  }

  const filteredWatches = watches.filter(w =>
    `${w.name} ${w.brand_slug} ${w.reference} ${w.collection}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold">Watchpedia Admin</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">{watches.length} watches &middot; {brands.length} brands &middot; {corrections.filter(c => c.status === 'pending').length} pending corrections</span>
          <button onClick={() => setAuthed(false)} className="text-sm text-gray-400 hover:text-white">Logout</button>
        </div>
      </div>

      {/* Message toast */}
      {message && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b bg-white px-6">
        <div className="flex gap-6">
          {(['watches', 'brands', 'groups', 'blog', 'corrections'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-3 text-sm font-medium border-b-2 transition-colors capitalize ${
                tab === t ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {loading && <p className="text-gray-400 text-sm">Loading...</p>}

        {/* === WATCHES TAB === */}
        {tab === 'watches' && !editing && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <input
                type="text"
                placeholder="Search watches..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="px-4 py-2 border rounded-lg w-80 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => setEditing({ ...emptyWatch })}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800"
              >
                + Add Watch
              </button>
            </div>
            <div className="bg-white rounded-xl border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Brand</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Name</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Ref</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Collection</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Image</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredWatches.map(w => (
                    <tr key={w.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5 font-medium">{w.brand_slug}</td>
                      <td className="px-4 py-2.5">{w.name}</td>
                      <td className="px-4 py-2.5 text-gray-500">{w.reference}</td>
                      <td className="px-4 py-2.5 text-gray-500">{w.collection}</td>
                      <td className="px-4 py-2.5">
                        {w.image ? (
                          <span className="text-green-600 text-xs">Has image</span>
                        ) : (
                          <span className="text-red-500 text-xs">Missing</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        <button onClick={() => setEditing(w)} className="text-blue-600 hover:underline text-xs mr-3">Edit</button>
                        <button onClick={() => w.id && deleteWatch(w.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* === WATCH EDIT FORM === */}
        {tab === 'watches' && editing && (
          <WatchForm
            watch={editing}
            brands={brands}
            onSave={saveWatch}
            onCancel={() => setEditing(null)}
          />
        )}

        {/* === BRANDS TAB === */}
        {tab === 'brands' && !editingBrand && (
          <div>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setEditingBrand({ ...emptyBrand })}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800"
              >
                + Add Brand
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {brands.map(b => (
                <div key={b.slug} className="bg-white p-4 rounded-xl border hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{b.name}</h3>
                      <p className="text-xs text-gray-500">{b.country} &middot; Est. {b.founded}</p>
                    </div>
                    <button onClick={() => setEditingBrand(b)} className="text-blue-600 text-xs hover:underline">Edit</button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 line-clamp-2">{b.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === BRAND EDIT FORM === */}
        {tab === 'brands' && editingBrand && (
          <BrandForm brand={editingBrand} onSave={saveBrand} onCancel={() => setEditingBrand(null)} />
        )}

        {/* === GROUPS & BLOG placeholders === */}
        {tab === 'groups' && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-medium">Groups management</p>
            <p className="text-sm mt-1">Coming soon — groups are auto-populated from brand relationships</p>
          </div>
        )}
        {tab === 'blog' && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-medium">Blog editor</p>
            <p className="text-sm mt-1">Coming soon — write SEO-optimized posts about watches</p>
          </div>
        )}

        {/* === CORRECTIONS TAB === */}
        {tab === 'corrections' && (
          <CorrectionsPanel corrections={corrections} onUpdate={loadData} showMessage={showMessage} />
        )}
      </div>
    </div>
  );
}

// === WATCH FORM COMPONENT ===
function WatchForm({ watch, brands, onSave, onCancel }: {
  watch: Watch;
  brands: Brand[];
  onSave: (w: Watch) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(watch);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');
  const set = (field: string, value: string | number | boolean | null) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadMsg('Only PNG, JPG, or WebP files allowed');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setUploadMsg('File too large. Max 2MB.');
      return;
    }

    const client = getSupabaseClient();
    if (!client) return;

    setUploading(true);
    setUploadMsg('');

    // Generate a clean filename: brand-slug/watch-slug.ext
    const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
    const filePath = `${form.brand_slug || 'unknown'}/${form.slug || Date.now()}.${ext}`;

    const { error } = await client.storage
      .from('watch-images')
      .upload(filePath, file, { upsert: true, contentType: file.type });

    if (error) {
      setUploadMsg('Upload failed: ' + error.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = client.storage
      .from('watch-images')
      .getPublicUrl(filePath);

    set('image', urlData.publicUrl);
    setUploadMsg('Uploaded successfully!');
    setUploading(false);
    setTimeout(() => setUploadMsg(''), 3000);
  };

  return (
    <div className="bg-white p-6 rounded-xl border max-w-3xl">
      <h2 className="text-lg font-bold mb-4">{watch.id ? 'Edit Watch' : 'Add Watch'}</h2>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Name" value={form.name} onChange={v => set('name', v)} />
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Brand</label>
          <select
            value={form.brand_slug}
            onChange={e => set('brand_slug', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select brand...</option>
            {brands.map(b => <option key={b.slug} value={b.slug}>{b.name}</option>)}
          </select>
        </div>
        <Field label="Slug" value={form.slug} onChange={v => set('slug', v)} />
        <Field label="Reference" value={form.reference} onChange={v => set('reference', v)} />
        <Field label="Collection" value={form.collection} onChange={v => set('collection', v)} />
        <Field label="Case Diameter" value={form.case_diameter} onChange={v => set('case_diameter', v)} />
        <Field label="Case Material" value={form.case_material} onChange={v => set('case_material', v)} />
        <Field label="Case Thickness" value={form.case_thickness} onChange={v => set('case_thickness', v)} />
        <Field label="Movement" value={form.movement} onChange={v => set('movement', v)} />
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Movement Type</label>
          <select
            value={form.movement_type}
            onChange={e => set('movement_type', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Automatic">Automatic</option>
            <option value="Manual winding">Manual winding</option>
            <option value="Quartz">Quartz</option>
            <option value="Solar quartz">Solar quartz</option>
            <option value="Spring Drive">Spring Drive</option>
            <option value="Meca-Quartz">Meca-Quartz</option>
            <option value="Quartz (digital)">Quartz (digital)</option>
          </select>
        </div>
        <Field label="Crystal" value={form.crystal} onChange={v => set('crystal', v)} />
        <Field label="Dial Color" value={form.dial_color} onChange={v => set('dial_color', v)} />
        <Field label="Water Resistance" value={form.water_resistance} onChange={v => set('water_resistance', v)} />
        <Field label="Power Reserve" value={form.power_reserve} onChange={v => set('power_reserve', v)} />
        <Field label="Price" value={form.price} onChange={v => set('price', v)} />
        <Field label="Year Introduced" value={form.year_introduced?.toString() || ''} onChange={v => set('year_introduced', v ? parseInt(v) : null)} />
      </div>

      <div className="mt-4">
        <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={e => set('description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} />
          Featured
        </label>
      </div>

      {/* === IMAGE SECTION === */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Watch Image</h3>

        {/* Upload area */}
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <label className="block cursor-pointer">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white border rounded-lg hover:bg-gray-50 transition-colors w-fit">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-sm text-gray-600">{uploading ? 'Uploading...' : 'Upload Image'}</span>
              </div>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-400 mt-2">
              Recommended: <strong>500x500px</strong> PNG with transparent background. Max 2MB.
              <br />JPG/WebP also accepted. Images display at 300x300 on cards, 500x500 on detail pages.
            </p>
            {uploadMsg && (
              <p className={`text-xs mt-1 ${uploadMsg.includes('failed') || uploadMsg.includes('too') || uploadMsg.includes('Only') ? 'text-red-500' : 'text-green-600'}`}>
                {uploadMsg}
              </p>
            )}
          </div>

          {/* Preview */}
          {form.image && (
            <div className="w-32 h-32 bg-white rounded-lg border flex items-center justify-center p-2 shrink-0">
              <img src={form.image} alt="Preview" className="max-h-full max-w-full object-contain mix-blend-multiply" />
            </div>
          )}
        </div>

        {/* Image URL field */}
        <div className="mt-3">
          <Field label="Image URL (or paste external URL)" value={form.image} onChange={v => set('image', v)} />
        </div>

        {/* Image source / copyright */}
        <div className="mt-3">
          <Field label="Image Source / Copyright" value={form.image_source} onChange={v => set('image_source', v)} />
          <p className="text-xs text-gray-400 mt-1">e.g. &quot;Official Rolex press kit&quot;, &quot;Wikimedia Commons CC BY-SA 4.0&quot;, &quot;Brand website&quot;</p>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={() => onSave(form)} className="bg-gray-900 text-white px-6 py-2 rounded-lg text-sm hover:bg-gray-800">
          Save
        </button>
        <button onClick={onCancel} className="px-6 py-2 rounded-lg text-sm border hover:bg-gray-50">
          Cancel
        </button>
      </div>
    </div>
  );
}

// === BRAND FORM COMPONENT ===
function BrandForm({ brand, onSave, onCancel }: {
  brand: Brand;
  onSave: (b: Brand) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(brand);
  const set = (field: string, value: string | number | null) =>
    setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="bg-white p-6 rounded-xl border max-w-2xl">
      <h2 className="text-lg font-bold mb-4">{brand.slug ? 'Edit Brand' : 'Add Brand'}</h2>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Name" value={form.name} onChange={v => set('name', v)} />
        <Field label="Slug" value={form.slug} onChange={v => set('slug', v)} />
        <Field label="Country" value={form.country} onChange={v => set('country', v)} />
        <Field label="Founded" value={form.founded.toString()} onChange={v => set('founded', parseInt(v) || 2000)} />
        <Field label="Website" value={form.website} onChange={v => set('website', v)} />
        <Field label="Group Slug" value={form.group_slug || ''} onChange={v => set('group_slug', v || null)} />
      </div>
      <div className="mt-4">
        <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={e => set('description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={() => onSave(form)} className="bg-gray-900 text-white px-6 py-2 rounded-lg text-sm hover:bg-gray-800">
          Save
        </button>
        <button onClick={onCancel} className="px-6 py-2 rounded-lg text-sm border hover:bg-gray-50">
          Cancel
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

// === CORRECTIONS PANEL ===
function CorrectionsPanel({ corrections, onUpdate, showMessage }: {
  corrections: Correction[];
  onUpdate: () => void;
  showMessage: (msg: string) => void;
}) {
  const client = getSupabaseClient();
  const pending = corrections.filter(c => c.status === 'pending');
  const reviewed = corrections.filter(c => c.status !== 'pending');

  async function updateStatus(id: number, status: string) {
    if (!client) return;
    const { error } = await client.from('watch_corrections').update({ status }).eq('id', id);
    if (error) return showMessage('Error: ' + error.message);
    showMessage('Correction marked as ' + status);
    onUpdate();
  }

  if (corrections.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg font-medium">No corrections yet</p>
        <p className="text-sm mt-1">User-submitted spec corrections will appear here</p>
      </div>
    );
  }

  function CorrectionRow({ c }: { c: Correction }) {
    return (
      <tr className="hover:bg-gray-50">
        <td className="px-4 py-3">
          <p className="font-medium text-sm">{c.watch_name}</p>
          <p className="text-xs text-gray-400">{c.brand_slug} &middot; {c.watch_reference}</p>
        </td>
        <td className="px-4 py-3 text-sm text-gray-600">{c.field_name}</td>
        <td className="px-4 py-3">
          {c.current_value && <p className="text-xs text-gray-400 line-through">{c.current_value}</p>}
          <p className="text-sm font-medium text-green-700">{c.correct_value}</p>
        </td>
        <td className="px-4 py-3 text-xs text-gray-500 max-w-xs">{c.reporter_note || '—'}</td>
        <td className="px-4 py-3 text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString()}</td>
        <td className="px-4 py-3">
          {c.status === 'pending' ? (
            <div className="flex gap-2">
              <button onClick={() => updateStatus(c.id, 'applied')} className="text-xs text-green-600 hover:underline">Applied</button>
              <button onClick={() => updateStatus(c.id, 'dismissed')} className="text-xs text-red-500 hover:underline">Dismiss</button>
            </div>
          ) : (
            <span className={`text-xs px-2 py-0.5 rounded-full ${c.status === 'applied' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {c.status}
            </span>
          )}
        </td>
      </tr>
    );
  }

  return (
    <div>
      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Pending ({pending.length})</h2>
          <div className="bg-white rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Watch</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Field</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Correction</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Note</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pending.map(c => <CorrectionRow key={c.id} c={c} />)}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reviewed.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-400 mb-3">Reviewed ({reviewed.length})</h2>
          <div className="bg-white rounded-xl border overflow-hidden opacity-60">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Watch</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Field</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Correction</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Note</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {reviewed.map(c => <CorrectionRow key={c.id} c={c} />)}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
