import { useState, useEffect } from 'react';
import initialPosts from './notas.json';

const PostForm = ({ formData, onChange, onSave, onCancel, isNew }) => (
  <div className="p-6 flex flex-col gap-4 bg-white rounded-xl shadow-md border-2 border-[#6c0820]">
    <h2 className="text-xl font-bold text-[#6c0820] mb-2">
      {isNew ? 'Redactar Nueva Nota' : 'Editando Nota'}
    </h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={onChange}
        className="w-full text-lg font-semibold border-b-2 border-gray-200 focus:border-[#6c0820] outline-none px-2 py-1 transition-colors"
        placeholder="Título de la nota"
      />
      <input
        type="text"
        name="author"
        value={formData.author}
        onChange={onChange}
        className="w-full text-lg border-b-2 border-gray-200 focus:border-[#6c0820] outline-none px-2 py-1 transition-colors"
        placeholder="Tu nombre (Autora)"
      />
    </div>
    
    <input
      type="text"
      name="imageUrl"
      value={formData.imageUrl}
      onChange={onChange}
      className="w-full text-sm text-gray-500 border-b-2 border-gray-200 focus:border-[#6c0820] outline-none px-2 py-1 transition-colors"
      placeholder="URL de la imagen (ej: https://...)"
    />
    <textarea
      name="content"
      value={formData.content}
      onChange={onChange}
      rows="5"
      className="w-full border-2 border-gray-200 rounded-lg focus:border-[#6c0820] outline-none p-3 resize-none transition-colors"
      placeholder="Escribí el contenido acá..."
    />
    <div className="flex gap-3 mt-2">
      <button
        onClick={onSave}
        className="bg-[#6c0820] hover:bg-[#fe9bb8] hover:text-[#6c0820] text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer"
      >
        {isNew ? 'Publicar Nota' : 'Guardar Cambios'}
      </button>
      <button
        onClick={onCancel}
        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer"
      >
        Cancelar
      </button>
    </div>
  </div>
);

export default function BlogManager() {
  const [posts, setPosts] = useState(() => {
    const savedPosts = localStorage.getItem('blogPostsLocal');
    if (savedPosts) {
      return JSON.parse(savedPosts);
    }
    return initialPosts;
  });

  const [editingId, setEditingId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', imageUrl: '', author: '' });

  useEffect(() => {
    localStorage.setItem('blogPostsLocal', JSON.stringify(posts));
  }, [posts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStartCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData({ title: '', content: '', imageUrl: '', author: '' });
  };

  const handleSaveNew = () => {
    const newPost = {
      id: Date.now().toString(),
      ...formData
    };
    setPosts([newPost, ...posts]);
    setIsCreating(false);
  };

  const handleStartEdit = (post) => {
    setEditingId(post.id);
    setIsCreating(false);
    setFormData({
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl,
      author: post.author || ''
    });
  };

  const handleSaveEdit = (id) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, ...formData } : post
    ));
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás segura de que querés eliminar esta nota? Esta acción no se puede deshacer.")) {
      setPosts(posts.filter(post => post.id !== id));
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#f4dcdc] min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8 border-b-2 border-[#fe9bb8] pb-2">
        <h1 className="text-3xl font-bold text-[#6c0820]">
          Gestor del Blog
        </h1>
        {!isCreating && (
          <button
            onClick={handleStartCreate}
            className="bg-[#fe9bb8] hover:bg-[#6c0820] hover:text-[#fe9bb8] text-[#6c0820] border border-[#6c0820] px-5 py-2 rounded-lg font-bold transition-colors shadow-sm cursor-pointer"
          >
            + Nueva Nota
          </button>
        )}
      </div>

      <div className="grid gap-8">
        {isCreating && (
          <PostForm 
            formData={formData} 
            onChange={handleChange} 
            onSave={handleSaveNew} 
            onCancel={handleCancel} 
            isNew={true} 
          />
        )}

        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-[#fe9bb8]">
            {editingId === post.id ? (
              <PostForm 
                formData={formData} 
                onChange={handleChange} 
                onSave={() => handleSaveEdit(post.id)} 
                onCancel={handleCancel} 
                isNew={false} 
              />
            ) : (
              <div className="flex flex-col md:flex-row">
                {post.imageUrl ? (
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full md:w-64 h-48 md:h-auto object-cover flex-shrink-0"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=Sin+Imagen' }}
                  />
                ) : (
                  <div className="w-full md:w-64 h-48 md:h-auto bg-[#f4dcdc] flex flex-shrink-0 items-center justify-center text-[#6c0820] font-medium border-r border-[#fe9bb8]">
                    Sin imagen
                  </div>
                )}
                
                {/* AGREGADO: min-w-0 para que el flexbox respete los bordes */}
                <div className="p-6 flex flex-col flex-grow min-w-0">
                  <div className="flex justify-between items-start mb-2 gap-4">
                    {/* AGREGADO: break-words al título por si ponen uno muy largo */}
                    <h2 className="text-2xl font-bold text-gray-800 break-words">{post.title}</h2>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#6c0820] bg-[#f4dcdc] px-2 py-1 rounded border border-[#fe9bb8] whitespace-nowrap flex-shrink-0">
                      {post.author}
                    </span>
                  </div>
                  
                  {/* AGREGADO: break-all para cortar cadenas sin espacios forzadamente */}
                  <p className="text-gray-600 mb-4 flex-grow whitespace-pre-line line-clamp-4 break-all">
                    {post.content}
                  </p>
                  
                  <div className="flex gap-3 justify-end mt-auto pt-4 border-t border-gray-50">
                    <button
                      onClick={() => handleStartEdit(post)}
                      className="text-[#6c0820] border border-[#6c0820] hover:bg-[#6c0820] hover:text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-white bg-red-500 border border-red-500 hover:bg-red-700 hover:border-red-700 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {posts.length === 0 && !isCreating && (
          <div className="text-center py-12 text-[#6c0820] font-medium">
            Todavía no hay notas publicadas. ¡Animate a escribir la primera!
          </div>
        )}
      </div>
    </div>
  );
}