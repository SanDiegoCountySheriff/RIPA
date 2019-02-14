## Check For Names - Warning: Slow and many false positives
import re
import datetime
now = datetime.datetime.now().strftime('%Y-%m-%d %H%M%S')

# Deduplicate names from the master names file
uniquenames = []
finalnames = []
with open('names.txt', 'r') as file:
    names = file.read().splitlines()
for n in names: 
    if len(n) > 2:
        if n not in uniquenames:
            uniquenames.append(n)
# Remove Ambinguous Names from the deduplicated names list
with open('AmbiguousNames.txt', 'r') as file:
        ambiguousnames = file.read().splitlines()
for un in uniquenames:
    if un not in ambiguousnames:
        finalnames.append(un)
# Compare names (expression) against narrative file and log matches
with open('basisforsearch.txt', encoding="utf8") as file1:
    text = file1.read().splitlines()
log = open('log_names_' + now +'.txt', "a", encoding="utf8") 
for n in finalnames:  
    log.write('\n::: Name match for: '+ n +' ::: \n')   
    print('\n::: Name match for: '+ n +' ::: \n')      
    for t in text:            
        result = re.findall(r'^.*\s' + n + r'(\s.*|)$', t, re.M|re.I)      
        if result:                      
            for r in result:
                log.write(t + '\n')
                print(t + '\n')
