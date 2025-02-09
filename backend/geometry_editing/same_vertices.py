import trimesh
import numpy as np
from pathlib import Path

def load_mesh(file_path):
    return trimesh.load(file_path, process=False)

def get_vertex_count(mesh):
    return len(mesh.vertices)

def add_vertices(mesh, target_count):
    current_count = get_vertex_count(mesh)
    extra_count = target_count - current_count
    
    if extra_count <= 0:
        return mesh
    
    new_vertices = np.tile(mesh.vertices[-1], (extra_count, 1))
    new_faces = mesh.faces
    
    new_mesh = trimesh.Trimesh(
        vertices=np.vstack((mesh.vertices, new_vertices)),
        faces=new_faces
    )
    return new_mesh

def save_mesh(mesh, output_path):
    mesh.export(output_path)

def same_vertices(input_files, output_dir):
    meshes = [load_mesh(file) for file in input_files]
    max_vertex_count = max(get_vertex_count(mesh) for mesh in meshes)
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    for file, mesh in zip(input_files, meshes):
        updated_mesh = add_vertices(mesh, max_vertex_count)
        save_mesh(updated_mesh, output_dir / Path(file).name)
    
    print("All models now have the same vertex count.")
    return 'same vertices complete'




