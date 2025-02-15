from pathlib import Path
import open3d as o3d
import numpy as np

def simplify_mesh_with_open3d(mesh_url: str, percentage: float, output_file: str = "simplified_mesh.obj") -> o3d.geometry.TriangleMesh:
    """
    Simplifies a mesh by reducing its vertex count to a given percentage using Open3D.
    
    Args:
        mesh_url (str): URL or file path to the mesh file (e.g., OBJ, STL).
        percentage (float): Reduction target as a percentage of the original vertex count (0 to 1).
        output_file (str): Path to save the simplified mesh file.
        
    Returns:
        o3d.geometry.TriangleMesh: The simplified mesh object.
    """
    # Validate input
    if not (0 < percentage <= 1):
        raise ValueError("Percentage must be between 0 and 1 (exclusive).")
    
    print('Loading mesh...')
    # Load the mesh
    mesh = o3d.io.read_triangle_mesh(mesh_url)
    if mesh.is_empty():
        raise ValueError(f"Failed to load mesh from {mesh_url}")
    
    print('Mesh loaded.')
    # Get the original vertex count
    original_vertex_count = len(mesh.vertices)
    target_vertex_count = max(2, int(original_vertex_count * percentage))
    
    print(f"Original vertex count: {original_vertex_count}")
    print(f"Target vertex count: {target_vertex_count}")
    
    # Simplify the mesh using quadratic decimation
    print('Simplifying mesh...')
    simplified_mesh = mesh.simplify_quadric_decimation(target_vertex_count)
    
    # Save the simplified mesh
    
    return simplified_mesh



def simplify_mesh_with_vertex_clustering(mesh_url: str, percentage: float) -> o3d.geometry.TriangleMesh:
    """
    Simplifies a mesh using vertex clustering with Open3D.
    
    Args:
        mesh_url (str): File path to the mesh file (e.g., OBJ, STL).
        percentage (float): Reduction target as a percentage of the original vertex count (0 to 1).
        output_file (str): Path to save the simplified mesh file.
        
    Returns:
        o3d.geometry.TriangleMesh: The simplified mesh object.
    """
    # Validate input
    if not (0 < percentage <= 1):
        raise ValueError("Percentage must be between 0 and 1 (exclusive).")
    
    # Load the mesh
    mesh = o3d.io.read_triangle_mesh(mesh_url)
    original_vertex_count = len(np.asarray(mesh.vertices))
    
    # Compute the target voxel size based on the percentage
    bounding_box = mesh.get_axis_aligned_bounding_box()
    bbox_diagonal_length = np.linalg.norm(bounding_box.get_extent())
    target_vertex_count = int(original_vertex_count * percentage)
    voxel_size = bbox_diagonal_length / (target_vertex_count**(1/3))
    
    print(f"Original vertex count: {original_vertex_count}")
    print(f"Target vertex count: {target_vertex_count}")
    print(f"Voxel size for clustering: {voxel_size}")
    
    # Simplify the mesh using vertex clustering
    simplified_mesh = mesh.simplify_vertex_clustering(voxel_size=voxel_size, contraction=o3d.geometry.SimplificationContraction.Quadric)
    return simplified_mesh

def save_mesh(mesh, output_dir, file):
        output_dir = Path(output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)
        output_path = output_dir / Path(file).name 
        o3d.io.write_triangle_mesh(output_path, mesh)

def simplify_mesh(input_files, output_dir, reduction_percentage):
    print("Simplification starting.")
    # Simplify the mesh
    for file in input_files:
        simplified_mesh = simplify_mesh_with_vertex_clustering(file, reduction_percentage,)
        save_mesh(simplified_mesh, output_dir, file)
    print("Simplification complete.")
    return 'Simplification complete'
