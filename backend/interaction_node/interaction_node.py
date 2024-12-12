
# ALGOS
from .detection import posenet as Posenet

class InteractionNode():
    def __init__(self):
        self.currentAlgorithm = None
        self.isRunning = False

    def InitializeInteractionNode(self):
        self.isRunning = False
        if self.currentAlgorithm != None:
            self.currentAlgorithm.stop_running()
        return True

    def StopAlgorithm(self):
        self.isRunning = False
        if self.currentAlgorithm != None:
            print('stopping')
            self.currentAlgorithm.stop_running()
        return True
    
    def InitializeAlgorithm(self, request):
        is_algorithm_initialized = False
        if self.isRunning == False:
            if(request.algorithm_type == "POSENET"):
                print('setting to posenet')
                self.currentAlgorithm = Posenet.Posenet()
                self.currentAlgorithm.set_config(request.algorithm_config)
                is_algorithm_initialized = True
        else:
            is_algorithm_initialized = True
        if is_algorithm_initialized == True:
            return  print(f"{request.algorithm_type} initialized", flush=True)
        else:
            return print(f"{request.algorithm_type} not initialized", flush=True)

    def RunAlgorithm(self):
       
        if(self.currentAlgorithm != None):
            if(self.isRunning == False):
                self.currentAlgorithm.run_algorithm()
                self.isRunning = True
            while self.isRunning == True:
                coords = self.currentAlgorithm.get_smoothed_cluster_coords()
               
        else:
            return print(f"error running current algorithm not initialized", flush=True)

    