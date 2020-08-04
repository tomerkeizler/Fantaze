import mongo
#from __future__ import print_function
#from ortools.algorithms import pywrapknapsack_solver
import numpy

leagues132 = []

# fixed_quantity:   num_items=numOfItems, items=values&weights, max_cost=W, count=count
def dynamic_program_knapsack(W, weights, values, numOfItems, count):
    matrix = numpy.zeros((numOfItems,W + 1,count+1))
    for i in range(numOfItems):
        for j in range(W+1):
            for k in range(count+1):
                if weights[i] > j or 1 > k:
                    matrix[i][j][k] = matrix[i-1][j][k]
                else:
                    matrix[i][j][k] = max(matrix[i-1][j][k], values[i] + matrix[i-1][j-weights[i]][k-1])
    
    return matrix

def get_used_items(W, weights, values, numOfItems, count ,matrix):
    itemIndex = len(weights) - 1
    currentCost = -1
    currentCount = -1
    marked = [0] * len(matrix)

    #Locate the cell with the maximun value:
    bestValue = -1
    for j in range(W+1):
        for k in range(count+1):
            value = matrix[itemIndex][j][k]
            if(bestValue == -1 or value > bestValue):
                currentCost = j
                currentCount = k
                bestValue = value
            
    while itemIndex >= 0 and currentCost >= 0 and currentCount >= 0:
        if (itemIndex == 0 and matrix[itemIndex][currentCost][currentCount] > 0) or (matrix[itemIndex][currentCost][currentCount] != matrix[itemIndex-1][currentCost][currentCount]):
            marked[itemIndex] = 1
            currentCost -= weights[itemIndex]
            currentCount -= 1
        itemIndex -= 1
    
    return marked



weights = [4, 3, 5, 7, 7]
values = [6, 4, 5, 3, 7]
final_matrix = dynamic_program_knapsack(15, weights, values, 5, 3)
elements = get_used_items(15, weights, values, 5, 3, final_matrix)
print(elements)





# classic knapsack: (we probabbly don't gonna use this)
def knapsack(W, weights, values, numOfItems):
    k = [[0 for i in range(W + 1)] for j in range(numOfItems + 1)] # init matrix to zero
    for i in range (numOfItems + 1):
        for w in range(W + 1):
            if i == 0 or w == 0:
                k[i][w] = 0
            elif weights[i - 1] <= w:
                k[i][w] = max(values[i-1] + k[i-1][w-weights[i-1]], k[i-1][w])
            else:
                k[i][w] = k[i-1][w]

    return k[numOfItems][W]

# players = mongo.get_random_team()
# weights = []
# values = []

# def update_weight():
#     for player in players:
#         weights.append(player['price'])

# def update_value():
#     for i in range(1,29):
#         values.append(i)

# update_weight()
# update_value()
# knapsack(100, weights, values, len(values))