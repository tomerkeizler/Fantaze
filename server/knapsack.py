import mongo
import numpy

leagues132 = []

# fixed_quantity:
#  W = Capacity, players = dict of id->player, count = how many elements to collect
def dynamic_program_knapsack(W, players, count):
    numOfItems = len(players)
    matrix = numpy.zeros((numOfItems,W + 1,count+1))
    keys = list(players.keys())
    for i in range(numOfItems):
        for j in range(W+1):
            for k in range(count+1):
                if players[keys[i]].price > j or 1 > k:
                    matrix[i][j][k] = matrix[i-1][j][k]
                else:
                    matrix[i][j][k] = max(matrix[i-1][j][k], players[keys[i]].performance + matrix[i-1][j-players[keys[i]].price][k-1])
    
    return matrix

def get_used_items(W, players, count ,matrix):
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
            
    while itemIndex >= 0 and currentCost >= 0 and currentCount >= 0:
        if (itemIndex == 0 and matrix[itemIndex][currentCost][currentCount] > 0) or (matrix[itemIndex][currentCost][currentCount] != matrix[itemIndex-1][currentCost][currentCount]):
            marked[itemIndex] = 1
            currentCost -= players[keys[itemIndex]].price
            currentCount -= 1
        itemIndex -= 1
    
    return marked

players = mongo.create_player_avg_performance_map()
values_list = list(players.values())
final_matrix = dynamic_program_knapsack(100, players, 11)
elements = get_used_items(100, players, 11, final_matrix)
fantasy_league = []

for i in range(len(elements)):
    if elements[i] == 1:
        fantasy_league.append(values_list[i])









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
