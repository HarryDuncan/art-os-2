
# ALGOS
from .detection.bodypix import BodyPix
from .detection.posenet import Posenet

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
            self.currentAlgorithm.stop_running()
        return True
    
    def InitializeAlgorithm(self, request):
        if self.isRunning == False:
            if(request.algorithm_type == "POSENET"):
                self.currentAlgorithm = Posenet()
            if(request.algorithm_type == "BODYPIX"):
                self.currentAlgorithm = BodyPix()
        if self.currentAlgorithm != None:
            self.currentAlgorithm.set_config(request.algorithm_config)
        return self.currentAlgorithm != None

    def RunAlgorithm(self):
        if(self.currentAlgorithm != None):
            if(self.isRunning == False):
                self.currentAlgorithm.run_algorithm()
                self.isRunning = True
            while self.isRunning == True:
                coords = self.currentAlgorithm.get_smoothed_cluster_coords()
               
        else:
            return print(f"error running current algorithm not initialized", flush=True)

    