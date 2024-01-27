# dependencies
import random
import csv
import sys

# constants
POPULATION_SIZE = 10
NUMBER_OF_GENES = 9

# options for GENES 1-9
Genes = [[8, 9, 10], [16, 17, 18, 19, 20, 21, 22], [45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60],
         [45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60], [9, 10, 11, 12, 13],
         [11, 12, 13, 14, 15], [2, 3], [9, 10], [3, 4, 5]]

#1 frontSpanGenes
#2 backSpanGenes
#3 frontAngleGenes
#4 backAngleGenes
#5 frontHeightGenes
#6 backHeightGenes
#7 frontWidthGenes
#8 backWidthGenes
#9 MiddleGenes

# collection of all current chromosomes
current_population = [[] for i in range(POPULATION_SIZE)]

# randomize the population
for i in range(POPULATION_SIZE):
    for j in range(9):
        current_population[i].append(random.choice(Genes[j]))

#ask users for coefficients for each fitness score but coefficients must add up to 1

target_speed = (sys.argv[1])
target_speed = float(target_speed)
target_endurance = (sys.argv[2])
target_endurance = float(target_endurance)
target_agility = (sys.argv[3])
target_agility = float(target_agility)


def get_speedfitness_score(chromosome):
    targetEquation = (-1.00202474 + (0.121679688*chromosome[0]) + (0.060481771*chromosome[1])  # equation for speed. Variables from HammerHead Plane Data.
                      + (0.006546875*chromosome[2]) + (0.002838542 * chromosome[3]) + (0.009433594*chromosome[4])
                      + (0.004296875*chromosome[5]) + (0.016015625 * chromosome[6]) + (0.0375*chromosome[7])
                      + (0.002148437*chromosome[7]))

    return targetEquation

def get_endurancefitness_score(chromosome):
    targetEquation1 = (-1.501178385 + (0.149101563*chromosome[0]) + (0.034361979*chromosome[1])  # equation for endurance. Variables from HammerHead Plane Data.
                      + (0.011317708*chromosome[2]) + (0.002755208 * chromosome[3]) + (0.005058594*chromosome[4])
                      + (0.003164063*chromosome[5]) + (0.00484375 * chromosome[6]) + (0.00875*chromosome[7])
                      + (0.004726563*chromosome[7]))
    return targetEquation1

def get_agilityfitness_score(chromosome):
    targetEquation2 = (0.119563802 + (0.093691406*chromosome[0]) + (0.046764323*chromosome[1])  # equation for endurance. Variables from HammerHead Plane Data.
                      + (0.003945312*chromosome[2]) + (0.003065104 * chromosome[3]) + (0.005380859*chromosome[4])
                      + (0.004208984*chromosome[5]) + (0.014335937 * chromosome[6]) + (-0.009023438*chromosome[7])
                      + (0.004238281*chromosome[7]))
    return targetEquation2

def get_total_fitness_score(chromosome):
    speed = get_speedfitness_score(chromosome)
    endurance = get_endurancefitness_score(chromosome)
    agility = get_agilityfitness_score(chromosome)
    totalFitnessScore = (target_speed* speed) + (target_endurance * endurance) + (target_agility * agility)
    return totalFitnessScore


last_value = 0
for i in range(10000):
    scores = [get_total_fitness_score(chromosome)
              for chromosome in current_population]
    sorted_scores = sorted(enumerate(scores), key=lambda x: x[1], reverse=True)

    parent1 = current_population[sorted_scores[0][0]]
    parent2 = current_population[sorted_scores[1][0]]

    split_point = random.randint(1, NUMBER_OF_GENES - 1)
    children = []
    for i in range(POPULATION_SIZE - 2):
        child = parent1[:split_point] + parent2[split_point:]
        children.append(child)

    # mutate the children
    for i in range(POPULATION_SIZE - 2):
        for j in range(NUMBER_OF_GENES):
            if random.random() < 0.05:
                children[i][j] = random.choice(Genes[j])

    # add the children to the population
    current_population = [parent1, parent2] + children

# print the best score
print("The Genetic Algorithm found that this was the best plane: ",current_population[0])
print("Front Span: " + str(current_population[0][0]) + " cm.")
print("Back Span: " + str(current_population[0][1]) + " cm.")
print("Front Angle: " + str(current_population[0][2]) + " degrees.")
print("Back Angle: " + str(current_population[0][3]) + " degrees.")
print("Front Height: " + str(current_population[0][4]) + " mm.")
print("Back Height: " + str(current_population[0][5]) + " mm.")
print("Front Width: " + str(current_population[0][6]) + " cm.")
print("Back Width: " + str(current_population[0][7]) + " cm.")
print("Middle Gap: " + str(current_population[0][8]) + " cm.")
print("The Score for speed is:", get_speedfitness_score(current_population[0]))
print("The Score for endurance is:", get_endurancefitness_score(current_population[0]))
print("The Score for handling is:", get_agilityfitness_score(current_population[0]))

f = open('HammerHeadGeneticAlgorithm.csv', 'w')

writer = csv.writer(f)
writer.writerow(['Front Span', 'Back Span', 'Front Angle', 'Back Angle', 'Front Height', 'Back Height', 'Front Width', 'Back Width', 'Middle Gap'])
writer.writerow([current_population[0][0], current_population[0][1], current_population[0][2], current_population[0][3], current_population[0][4], current_population[0][5], current_population[0][6], current_population[0][7], current_population[0][8]])
writer.writerow(['Target Speed', 'Target Endurance', 'Target Agility'])
writer.writerow([target_speed, target_endurance, target_agility])
writer.writerow(['Speed Score', 'Endurance Score', 'Agility Score'])
writer.writerow([get_speedfitness_score(current_population[0]), get_endurancefitness_score(current_population[0]), get_agilityfitness_score(current_population[0])])
f.close()