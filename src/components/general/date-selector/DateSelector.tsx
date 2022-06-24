import { useEffect, useState } from 'react'
import * as f from '../../helpers'
import { Day } from './Day'

interface DateSelectorProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function DateSelector({ open, setOpen }: DateSelectorProps) {

    const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const [selected, setSelected] = useState<f.DayType | undefined>(undefined)
    const [currentMonth, setCurrentMonth] = useState<f.DayType[][]>(f.getSplittedMonthArray(f.getMonth(2022, new Date().getMonth())))

    function handleSelectDay(day: f.DayType) {
        if (!selected) {
            setSelected(day)
            return
        }
        else if (selected.date.getTime() == day.date.getTime()) {
            setSelected(undefined)
        }
        else {
            setSelected(day)
        }
    }

    function handleChangeMonth(type: 'next' | 'prev', amount: number) {
        let monthNumber = currentMonth[2][3].date.getMonth()
        let yearNumber = currentMonth[2][3].date.getFullYear()
        if (type == 'next') {
            for (let i = 0; i < amount; i++) {
                let nextData = f.getNextMonth(yearNumber, monthNumber)
                monthNumber = nextData.month
                yearNumber = nextData.year
            }
        }
        else if (type == 'prev') {
            for (let i = 0; i < amount; i++) {
                let prevData = f.getPreviousMonth(yearNumber, monthNumber)
                monthNumber = prevData.month
                yearNumber = prevData.year
            }
        }
        const newCurrentMonth = f.getSplittedMonthArray(f.getMonth(yearNumber, monthNumber))
        setCurrentMonth(newCurrentMonth)
    }


    return (
        <div 
            className={`rdp date-picker-wrapper ${open ? 'open' : 'closed'}`}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="rdp date-picker-header">
                <div onClick={e => handleChangeMonth('prev', 1)} className="rdp scroll-arrow left">
                    prev
                </div>
                <h3 className="rdp month-year">
                    {monthNames[currentMonth[3][3].date.getMonth()]} {currentMonth[3][3].date.getFullYear()}
                </h3>
                <div onClick={e => handleChangeMonth('next', 1)}className="rdp scroll-arrow right">
                    next
                </div>
            </div>
            <table className="rdp date-picker table">
                    <tr>
                        {days.map((day, i) => {
                            return <th className="rdp calendar-day-title" key={i}>{day}</th>
                        })}
                    </tr>
            </table>
            <div className="rdp date-picker-calendar-wrapper">
                <table className="rdp date-picker table">
                        {currentMonth.map((row, i) => {
                            return (
                                <tr key={i}>
                                    {row.map((day, i) => {
                                        return <Day selected={selected} data={day} key={i} handleSelectDay={handleSelectDay}/>
                                    })}
                                </tr>
                            )
                        })}
                </table>
            </div>
            <div className="rdp date-picker-buttons-wrapper">
                <button className="rdp button secondary-button">Cancel</button>
                <button onClick={e => setOpen(false)} className="rdp button primary-button">Apply</button>
            </div>
        </div>
    )
}