import mongo
import numpy
import json
from flask import jsonify
import math

# fixed_quantity:
#  W = Capacity, players = dict of id->player, count = how many elements to collect
def dynamic_program_knapsack(W, players, count):
    numOfItems = len(players)
    matrix = numpy.zeros((numOfItems,W + 1,count+1))
    keys = list(players.keys())
    for i in range(numOfItems):
        for j in range(W+1):
            for k in range(count+1):
                if players[keys[i]]["price"] > j or 1 > k:
                    matrix[i][j][k] = matrix[i-1][j][k]
                else:
                    matrix[i][j][k] = max(matrix[i-1][j][k], players[keys[i]]["performance"] + matrix[i-1][j-players[keys[i]]["price"]][k-1])
                    # current_value = matrix[i-1][j-players[keys[i]]["price"]][k-1]
                    # player_value = players[keys[i]]["performance"]
                    # sum_value = player_value + math.sqrt(current_value)
                    # matrix[i][j][k] = max(matrix[i-1][j][k], math.pow(sum_value, 2))
    return matrix

def get_used_indexes(W, players, count ,matrix):
    itemIndex = len(players) - 1
    currentCost = -1
    currentCount = -1
    marked = [0] * len(matrix)
    keys = list(players.keys())

    #Locate the cell with the maximun value:
    bestValue = -1
    for j in range(W+1):
        for k in range(count+1):
            value = matrix[itemIndex][j][k]
            if(bestValue == -1 or value > bestValue):
                currentCost = j
                currentCount = k
                bestValue = value
            
    print(bestValue)
    while itemIndex >= 0 and currentCost >= 0 and currentCount >= 0:
        if (itemIndex == 0 and matrix[itemIndex][currentCost][currentCount] > 0) or (matrix[itemIndex][currentCost][currentCount] != matrix[itemIndex-1][currentCost][currentCount]):
            marked[itemIndex] = 1
            currentCost -= players[keys[itemIndex]]["price"]
            currentCount -= 1
        itemIndex -= 1
    
    return marked

