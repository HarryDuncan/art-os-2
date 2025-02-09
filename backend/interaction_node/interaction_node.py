from mask.mask import MaskProcessor
class InteractionNode:
    def __init__(self):
        self.current_algorithm = None
        self.is_running = False

    def initialize_interaction_node(self):
        self.is_running = False
        if self.current_algorithm is not None:
            self.current_algorithm.stop_running()
        return True

    def stop_algorithm(self):
        self.is_running = False
        if self.current_algorithm is not None:
            self.current_algorithm.stop_running()
        return True

    def initialize_algorithm(self, algorithm_type, algorithm_config):
        if not self.is_running:
            match algorithm_type:
                case 'MASK':
                    self.current_algorithm = MaskProcessor()
                case _:
                    self.current_algorithm = None
        if self.current_algorithm is not None:
            self.current_algorithm.set_config(algorithm_config)
        return self.current_algorithm is not None

    def run_algorithm(self):
        if self.current_algorithm is None:
            print("Error: running current algorithm not initialized", flush=True)
            return
        
        if not self.is_running:
            self.current_algorithm.run_algorithm()
            self.is_running = True
        
        while self.is_running:
            coords = self.current_algorithm.get_smoothed_cluster_coords()
