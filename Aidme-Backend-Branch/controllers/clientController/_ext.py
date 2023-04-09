import requests
from bs4 import BeautifulSoup

def teams(name):
    url = f'https://www.skysports.com/{name}'
    forms = []
    # Make a GET request to the URL
    response = requests.get(url)

    # Parse the HTML content using BeautifulSoup
    soup = BeautifulSoup(response.content, 'html.parser')

    # Find all the tables on the page
    tables = soup.find_all('table')

    # Iterate over each table
    for table in tables:
        # Extract the league name from the table header
        league_name = table.find('caption').text.strip()
        print('\n' + league_name)
        print('-' * len(league_name))

        # Extract the table rows from the body
        rows = table.find('tbody').find_all('tr')

    

        # Initialize counters for wins, draws, losses
        wins = 0
        draws = 0
        losses = 0

        # Iterate over each row
        for row in rows:
          
            # Extract the team name and their statistics
            name = row.find('td', class_='standing-table__cell standing-table__cell--name').text.strip()
            played = int(row.find_all('td')[2].text.strip())
            won = int(row.find_all('td')[3].text.strip())
            drawn = int(row.find_all('td')[4].text.strip())
            lost = int(row.find_all('td')[5].text.strip())
            gf = int(row.find_all('td')[6].text.strip())
            ga = int(row.find_all('td')[7].text.strip())
            gd = int(row.find_all('td')[8].text.strip())
            points = int(row.find_all('td')[9].text.strip())
            td = row.find('td', class_='standing-table__cell is-hidden--bp15 is-hidden--bp35')
            if td:
                form = td.find('div', class_='standing-table__form')
                if form:
                    spans = form.find_all('span')
                    titles = [span['title'] for span in spans]
                    
            # Check if the team has less than 6 losses or more than 17 losses
      #{", ".join(titles)}
            if played > 20:
                if lost < 6:
                    print(f'{name}  (Double chance for)')
                    
                    for i in titles:
                        parts = i.split("-")
                        
                        if len(parts) == 2:
                            first = (parts[0].strip())
                            second = (parts[1].strip())
                            print(f"{first}-{second}")

                elif lost > 17 or won < 6:
                    print(f'{name} (Double chance against)')
            else:
                print("League is still young")

print(teams("la-liga-table"))



