import re
import datetime
now = datetime.datetime.now().strftime('%Y-%m-%d %H%M%S')

# Pattern matching 
files = ['reasonforstop','basisforsearch'] # add multiple files if needed
for f in files:
    with open(f + '.txt', encoding="utf8") as myfile:
        text = myfile.read().splitlines()
    log = open('log_regex_' + f + '_' + now +'.txt', "a", encoding="utf8") 
    log.write(now)

    expressions = [ r'^.*[\U0001F300-\U0001F5FF].*$',   #Unicode Emoji Range
                    r'^.*[\U0001F600-\U0001F64F].*$',   #Unicode Emoji Range
                    r'^.*[\u2702-\u27B0].*$',           #Unicode Emoji Range
                    r'^.*[\u24C2-\U0001F251].*$',       #Unicode Emoji Range
                    r'^.*"[A-Z]{1}\d{7}.*$',            #CA DL Number
                    r'^.*c?dl\s.*$',                    #CDL
                    r'^.*oln\s.*$',                     #OLN
                    r'^.*(?:[0]?[1-9]|[1][0-2])[./-](?:[0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]?(?:[0-9]{4}|[0-9]{2}).*$', #Dates
                    r'^.*jims\s?.*$',
                    r'^.*fbi\s?.*$',
                    r'^.*cii\s?.*$',
                    r'^.*state\s.*$'
                    r'^.*ssn\s?.*$',
                    r'^.*afis\s?.*$',
                    r'^.*scn\s?.*$',
                    r'^.*E\d{7}.*$',                    #cad number
                    r'^.*\d{8}.*$',                     #netrms number
                    r'(?:^|(?<= ))(av|ave|st|str|bl|cir|blvd|rd|ct|way|wy)(?:(?= )|$)', 
                    r'^.*(?:\d{3}-?\d{2}-?\d{4}|XXX-XX-XXXX).*$',   #SSN
                    r'^.*(?:\+\d{1,2}\s)?\(?:?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}.*$', #TEL#                     
                    #r'^.*[a-z ,.\'-]+.*$',             #Names
                    r'^.*\sAF(\s.*|)$',                 #profane appreviation AF 
                    r'(?:^|(?<= ))(http|https|://|.com|.net|.www)(?:(?= )|$)',  
                    r'(?:^|(?<= ))(SHIT|PISS|FUCK|CUNT|COCKSUCKER|MOTHERFUCKER|TITS)(?:(?= )|$)' #Seven Dirty Words
                    ]                   

    for e in expressions:
        log.write('\n::: Pattern match for expression: '+ e +' ::: \n') 
        for t in text:
            result = re.findall(e, t, re.M|re.I)             
            if result:    
                for r in result:
                    log.write(t + '\n')





